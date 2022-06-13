import React from 'react';
import ReactDOM from 'react-dom';
import { IoCloseOutline } from 'react-icons/io5';

const LICENSES = [
  [ 'creativecommons.org/licenses/by', 'CC BY' ],
  [ 'creativecommons.org/licenses/by-sa', 'CC BY-SA' ],
  [ 'creativecommons.org/licenses/by-nc', 'CC BY-NC' ],
  [ 'creativecommons.org/licenses/by-nc-sa', 'CC BY-NC-SA' ],
  [ 'creativecommons.org/licenses/by-nd', 'CC BY-ND' ],
  [ 'creativecommons.org/licenses/by-nc-nd', 'CC BY-NC-ND' ],
  [ 'creativecommons.org/publicdomain/zero', 'CC0' ]
];

export const formatLicense = url => {
  const match = LICENSES.find(t => url.indexOf(t[0]) > - 1);
  return match ? 
    <a href={match[0]} target="_blank">{match[1]}</a> :
    <a href={url} target="_blank">{url}</a>;
}

const DatasetDetails = props => {

  const { data } = props;

  console.log(data);

  return ReactDOM.createPortal(
    <div className="p6o-loading-dataset-details-container">
      <button
        className="p6o-loading-dataset-details-close"
        onClick={props.onClose}>
        <IoCloseOutline />
      </button>

      <div className="p6o-loading-dataset-details">
        <ul>
          {data.map(([name, metadata], idx) =>
            <li key={name + idx}>
              <h3>{metadata.name}</h3>
              <p>{metadata.description}</p>
              {metadata.license && 
                <p>
                  License: {formatLicense(metadata.license)}
                </p>
              }
              <p>
                Source: <a href={metadata.identifier} target="_blank">{metadata.identifier}</a>
              </p>
            </li>
          )}
        </ul>
      </div>
    </div>, document.body
  );

}

export default DatasetDetails;