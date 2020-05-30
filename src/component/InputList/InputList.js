import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './InputList.css';


export default function InteractiveList(props) {

  const content = props.items.map((item, id) =>
  <tbody key={item.key}>
    <tr>
      <th scope="row">{id+1}</th>
      <td id={item.key} value={item.text}>{item.text}</td>
      <td className="delete"><FontAwesomeIcon className="faicons" icon="trash" onClick={ ()=> {props.deleteItem(item.key)}}/></td>
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
      <th className="delete" scope="col"><FontAwesomeIcon className="faicons" icon="trash" onClick={ ()=> {props.deleteAll()}}></FontAwesomeIcon></th>
      </tr>
    </thead>
      {content}
  </table>
    </div>
   
  );
}
