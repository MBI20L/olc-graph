import React from 'react';
import AddElement from '../AddElement/AddElement';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



export default function DefaultList(props) {

  const content = props.items.map((input) =>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>{input.text}</td>
      <td></td>
     </tr> 
  </tbody>
);
 
  return (
    <div className="m5-4">
      <table className="table table-striped">
    <thead className="thead-dark">
      <tr>
      <th scope="col">#</th>
      <th scope="col">Odczyt</th>
      <th scope="col"></th>
      </tr>
    </thead>
    
      {content}

  </table>
    </div>
   
  );
}
