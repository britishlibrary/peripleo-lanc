import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { ImLink } from 'react-icons/im';
import { IoCloseOutline } from 'react-icons/io5';

const ShareModal = props => {

  const el = useRef();

  const url = window.location.href;

  const embedCode = `<iframe src="${url}" width="100%" height="100%"></iframe>`;

  useEffect(() => {
    const onKeyDown = evt => {
      if (evt.key === 'Escape')
        props.onClose();
    }

    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const selectURL = () =>
    el.current.querySelector('.p6o-share-url input').select();
  
  const selectEmbedCode = () =>
    el.current.querySelector('.p6o-embed-code input').select();
  
  return ReactDOM.createPortal(
    <div
      ref={el} 
      className="p6o-share-modal-wrapper">
      
      <button
        className="p6o-close-share-modal"
        onClick={props.onClose}>
        <IoCloseOutline />
      </button>
      
      <div className="p6o-share-modal">
        <section className="p6o-share-url">
          <h2>Link to this map</h2>
          <input 
            readOnly
            value={url} 
            onFocus={selectURL} />
        </section>

        <section className="p6o-embed-code">
          <h2>Embed this map</h2>
          <input
            readOnly
            value={embedCode} 
            onFocus={selectEmbedCode}/>
          <footer>
            <a 
              href="https://github.com/britishlibrary/peripleo/blob/main/Configuration-Guide.md#-embedding-your-map"
              target="_blank">See here</a> for MediaWiki instructions
          </footer>
        </section>
      </div>
    </div>, document.body
  )

}

const ShareLink = () => {

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        className="p6o-share-button"
        tabIndex={3}
        aria-label="Share link to map"
        onClick={() => setModalOpen(true)}>
        <ImLink />
      </button>

      {modalOpen && 
        <ShareModal onClose={() => setModalOpen(false)} />
      }
    </>
  )

}

export default ShareLink;