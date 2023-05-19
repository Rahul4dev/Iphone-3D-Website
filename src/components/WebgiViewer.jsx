import React, {
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import {
  ViewerApp,
  AssetManagerPlugin,
  GBufferPlugin,
  ProgressivePlugin,
  TonemapPlugin,
  SSRPlugin,
  SSAOPlugin,
  BloomPlugin,
  GammaCorrectionPlugin,
  mobileAndTabletCheck,
} from 'webgi';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollAnimation } from '../lib/scroll-animation';

gsap.registerPlugin(ScrollTrigger);

const WebgiViewer = forwardRef((props, ref) => {
  const canvasRef = useRef(null);

  const [viewerRef, setViewerRef] = useState(null);
  const [targetRef, setTargetRef] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [positionRef, setPositionRef] = useState(null);

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const canvasContainerRef = useRef(null);

  const [isMobile, setIsMobile] = useState(null);

  useImperativeHandle(ref, () => ({
    triggerPreview() {
      setIsPreviewMode(true);
      canvasContainerRef.current.style.pointerEvents = 'all';
      props.contentRef.current.style.opacity = '0';

      gsap.to(positionRef, {
        x: 13.04,
        y: -2.01,
        z: 2.29,
        duration: 2,
        onUpdate: () => {
          viewerRef.setDirty();
          cameraRef.positionTargetUpdated(true);
        },
      });

      gsap.to(targetRef, {
        x: 0.11,
        y: 0.0,
        z: 0.0,
        duration: 2,
      });

      viewerRef.scene.activeCamera.setCameraOptions({ controlsEnabled: true });
    },
  }));

  const memoizedScrollAnimation = useCallback(
    (position, target, isMobile, onUpdate) => {
      if (position && target && onUpdate) {
        scrollAnimation(position, target, isMobile, onUpdate);
      }
    },
    []
  );

  const setupViewer = useCallback(async () => {
    // Initialize the viewer
    const viewer = new ViewerApp({
      canvas: canvasRef.current,
    });

    setViewerRef(viewer);
    const isMobileOrTablet = mobileAndTabletCheck(); //
    setIsMobile(isMobileOrTablet);

    const camera = viewer.scene.activeCamera;
    const position = camera.position;
    const target = camera.target;

    setCameraRef(camera);
    setPositionRef(position);
    setTargetRef(target);

    // Add some plugins
    const manager = await viewer.addPlugin(AssetManagerPlugin);

    // Add plugins individually.
    await viewer.addPlugin(GBufferPlugin);
    await viewer.addPlugin(new ProgressivePlugin(32));
    await viewer.addPlugin(new TonemapPlugin(true));
    await viewer.addPlugin(GammaCorrectionPlugin);
    await viewer.addPlugin(SSRPlugin);
    await viewer.addPlugin(SSAOPlugin);

    await viewer.addPlugin(BloomPlugin);

    // This must be called once after all plugins are added.
    viewer.renderer.refreshPipeline();

    await manager.addFromPath('scene-black.glb');

    viewer.getPlugin(TonemapPlugin).config.clipBackground = true;

    // disable the control once we load the viewer
    viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false });

    if (isMobileOrTablet) {
      position.set(-16.7, 1.17, 11.7);
      target.set(0, 1.37, 0);
      props.contentRef.current.className = 'mobile-or-tablet';
    }

    // whenever we reload we want the first page and viewer on top.
    window.scrollTo(0, 0);

    let isUpdateRequired = true;

    const onUpdate = () => {
      isUpdateRequired = true;
      viewer.setDirty();
    };
    //so now we need a listener on viewer itself, which update the position of the camera if the update is needed.
    viewer.addEventListener('preFrame', () => {
      // we need our active camera first.
      if (isUpdateRequired) {
        camera.positionTargetUpdated(true);
        isUpdateRequired = false;
      }
    });

    memoizedScrollAnimation(position, target, isMobileOrTablet, onUpdate);
  }, []);

  useEffect(() => {
    setupViewer();
  }, []);

  const exitPreviewHandler = useCallback(() => {
    canvasContainerRef.current.style.pointerEvents = 'none';
    props.contentRef.current.style.opacity = '1';
    viewerRef.scene.activeCamera.setCameraOptions({ controlsEnabled: false });
    setIsPreviewMode(false);

    gsap.to(positionRef, {
      // change of position (we get from webGI position properties customized according to different positions. new camera views)
      x: !isMobile ? 1.56 : 9.36,
      y: !isMobile ? 5.0 : 10.95,
      z: !isMobile ? 0.011 : 0.09,
      // what to do: scroll trigger to start the animation
      scrollTrigger: {
        // from where it start? from .sound-section(element)
        trigger: '.display-section',
        // when to start the animation
        start: 'top bottom',
        // what will end the animation
        end: 'top top',
        // for smooth transitions (either true or a number)
        scrub: 2,
        // for decrease the rendering speed to ease the gpu
        immediateRender: false,
      },
      onUpdate: () => {
        viewerRef.setDirty();
        cameraRef.positionTargetUpdated(true);
      },
    });

    gsap.to(targetRef, {
      x: !isMobile ? -0.55 : -1.62,
      y: !isMobile ? 0.32 : 0.02,
      z: !isMobile ? 0.0 : -0.06,

      scrollTrigger: {
        trigger: '.display-section',
        start: 'top bottom',
        end: 'top top',
        scrub: 2,
        immediateRender: false,
      },
    });
  }, [canvasContainerRef, viewerRef, positionRef, targetRef, cameraRef]);

  return (
    <div id="webgi-canvas-container" ref={canvasContainerRef}>
      <canvas id="webgi-canvas" ref={canvasRef} />
      {isPreviewMode && (
        <button className="button" onClick={exitPreviewHandler}>
          Exit Preview
        </button>
      )}
    </div>
  );
});

export default WebgiViewer;
