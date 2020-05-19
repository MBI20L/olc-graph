import React from 'react';
import AddElement from '../AddElement/AddElement';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



export default function InteractiveList(props) {

  const items = props.items;

  const content = props.items.map((item) =>
  <tbody key={item.key}>
    <tr>
      <th scope="row">1</th>
      <td id={item.key} value={item.text}>{item.text}</td>
      <td><FontAwesomeIcon className="faicons" icon="trash" onClick={ ()=> {props.deleteItem(item.key)}}/></td>
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
      <th scope="col"><FontAwesomeIcon className="faicons" icon="trash" onClick={ ()=> {props.deleteAll()}}></FontAwesomeIcon></th>
      </tr>
    </thead>
    
      {content}

  </table>
    </div>
   
  );
}
