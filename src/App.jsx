import { useRef } from 'react';
import Nav from './components/Nav';
import Jumbotron from './components/Jumbotron';
import SoundSection from './components/SoundSection';
import DisplaySection from './components/DisplaySection';
import WebgiViewer from './components/WebgiViewer';
import Loader from './components/Loader';

function App() {
  const webgiViewerRef = useRef();
  const contentRef = useRef();

  const previewHandler = () => {
    webgiViewerRef.current.triggerPreview();
  };

  return (
    <div className="App">
      <Loader />
      <div id="content" ref={contentRef}>
        <Nav />
        <Jumbotron />
        <SoundSection />
        <DisplaySection triggerPreview={previewHandler} />
      </div>

      <WebgiViewer contentRef={contentRef} ref={webgiViewerRef} />
    </div>
  );
}

export default App;
