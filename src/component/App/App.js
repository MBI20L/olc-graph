import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import ReactDOM from "react-dom";
import Graph from "react-graph-vis";
import './App.css';
import InputList from '../InputList/InputList';
import DefaultInputList from '../InputList/DefaultInputList';
import GraphOlc from '../GraphOlc/GraphOlc';


library.add(faTrash)

const defaultInputs = [
  'AAABA',
  'ABAAB',
  'BAABA',
  'AABAB'
];

// ALR enum dotyczący operacji wykonywanych przez algorytmy
const operationType = {
  SELECTION: "Subsequence selected",//dodanie podsekwencji do sekwencji
  REMOVAL:   "Sequence reverted",// wycofanie podsekwencji
  OVERLAP:   "Overlaps calculation" // wyznaczenie nakładania konkretnej podsekwencji 
  
}

// ALR enum opisujący możliwe opcje wyświetlania danych z historii algorytmu 
const HistoryVisualizationType = {
  CONSOLE: 'Console'
}

// Klasa do zbierania i zwracania kolejnych kroków algorytmu, na podstawie wzorca projetowego Command - ARL
class commandHistory {

  
}



class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        selectedOption: "option1",
        items: [],
        currentItem: {
            text:'',
            key: ''
        },
        lengthError: '', 
        nodes: [],// ALR zmienne do przechowywania danych grafu
        edges: [],
    }
    this.handleInput = this.handleInput.bind(this);
    this.addItem = this.addItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.deleteAll = this.deleteAll.bind(this);
    this.findSequence = this.findSequence.bind(this);
    this.getStartingindexAndValue = this.getStartingindexAndValue.bind(this);
    this.getOverlapValues = this.getOverlapValues.bind(this);
    this.getNextContigIndex = this.getNextContigIndex.bind(this);
    this.addNode = this.addNode.bind(this);
}

addNode(_edgeLabel){
  let node = {};
  node["id"] = this.state.nodes.length+1;
  node["label"] = _edgeLabel;
  node["title"] = _edgeLabel;
  this.state.nodes.push(node);

}
handleInput(e){
    this.setState({
        currentItem: {
            text: e.target.value,
            key: Date.now()
        }
    })
}

validate = () => {
  
  let lengthError = "";
  this.setState({lengthError});
  console.log("current item " + this.state.items[0] )

  if (this.state.items[0] === undefined){
    return true;
  } else if (this.state.currentItem.text.length !== this.state.items[0].text.length) {
    console.log("wymiar " + this.state.currentItem.text.length)
    console.log("wymiar " + this.state.items[0].text.length)
    lengthError = 'Odczyty muszą mieć te same wymiary! Wprowadź daną ponownie.';
    this.setState({lengthError});
    return false;
  } 

  return true;
} 

addItem(e){
    e.preventDefault();
    const isValid = this.validate();
    console.log(isValid)
    if (isValid) {
      console.log(this.state);
      const newItem = this.state.currentItem;
      console.log(newItem);
      if(newItem.text !== ''){
          const newItems = [...this.state.items, newItem];
          this.setState({
              items: newItems,
              currentItem: {
                  text: '',
                  key: ''
              }
          })
      }
      
    } else{
      this.state.currentItem.text = "";
    }
    
   

}

deleteItem(key){
  const filteredItem = this.state.items.filter(item =>
    item.key !== key);
    this.setState({
      items: filteredItem,
    })
}

deleteAll(){
  this.setState({
    items: []
  })
}

handleOptionChange = changeEvent => {
  this.setState({
    selectedOption: changeEvent.target.value
  });
};

// Metoda zwracająca nakładający się fragment obu sekwencji.
 findOverlap(a, b) {
   
  if (b.length === 0) {
    return "";
  }

  if (a.endsWith(b)) {
    return b;
  }
  // Opcjonalne sprawdzanie nakładanie się z lewej strony,
  // ale na razie wystarczy nam sprawdzanie prawostronne.
  //if (a.indexOf(b) >= 0) {
   // return b;
  //}

  return this.findOverlap(a, b.substring(0, b.length - 1));  
}
// Metoda zwracająca długość nakładającego się fragmentu obu sekwencji.
findOverlapLength(a,b) {
  return this.findOverlap(a, b).length;
}

// Wstępny prototyp implementacji algorytmu zachłannego. 
// Z obserwacją postępu w oknie konsoli. Do dalszej implementacji
// wyświetlanie wyników na stronie.

// ALR funkcja do ustalania indeksu startowej sekwencji 
getStartingindexAndValue(_inputs){
  // index - indeks startowego odczytu
  let index = Math.floor(Math.random() * _inputs.length);
  //let index = 0;
  let maxVal = 0;
  
  return [index, maxVal]
}

// ALR - funkcja do wyliczania nakładań na sekwencje wskazane w _inputs względem sekwencji _selectedContig. 
getOverlapValues(_selectedContig, _inputs){
  let j;
  let overlaping = [];
  if (_inputs.length !== 1){
    for(j=0; j<_inputs.length; j++){
      overlaping[j] = this.findOverlapLength(_selectedContig, _inputs[j]);
      this.showCurrentStepMsg('j: ' + j )
    }
  }
  return overlaping;
}

// ALR wyszukanie kolejnego kontiga
getNextContigIndex(_overlaping){
  let maxValLocal = 0;
  let currentIndexLocal = 0;
  
  if (_overlaping.length){
    maxValLocal = Math.max.apply(Math, _overlaping);
    this.showCurrentStepMsg(maxValLocal);
    currentIndexLocal = _overlaping.indexOf(maxValLocal) 
  }
  return [currentIndexLocal, maxValLocal] 
}

// ALR wypisywanie informacji o bieżącym działaniu, wyciągnięte do oddzielnej metody aby zmieniać między
// Konsolą a wypisaniem bezpośrednio na stronie.
showCurrentStepMsg(_msg){
  console.log(_msg)  
}

findSequence(){
  
  let inputs =[];
  //Pobranie danych wpisanych ręcznie
  const myInputs = this.state.items.map((item) => item.text);

  //Przypisanie tablicy w zależności od wybranego radiobuttona
  const defaultData = this.state.selectedOption == 'option1';
  if(defaultData){
    // ewentualnie użyć slice(0) aby zrobić płytką kopię
    inputs = [...defaultInputs];
    inputs.forEach(this.addNode) 
  } else {
    inputs = [...myInputs];
  }
  this.showCurrentStepMsg(this.state.nodes)
  this.showCurrentStepMsg("Dane wejsciowe");
  this.showCurrentStepMsg(inputs);

  let origInputLength = inputs.length;// ALR refaktor, jakbyśmy zdecydowali się coś zmienić, to w jednym miejscu lepiej zmieniać długosć
  this.showCurrentStepMsg('Długość wejściowa ' + origInputLength);
  let currInputLength = origInputLength; // ALR : informacja o bieżącej długości tablicy z podsekwencjami, na użytek pętli

  let i;
  let j;
  let overlaping = []

  // macierz nxn przechowująca wagi krawędzi między grafami, 
  // czyli długości nakładających się fragmentów obu sekwencji.
  let overlapArray = [];
 
    //Pobranie indeksu startowego odczytu oraz inicjalizacja zmiennej maxValue
    let index;
    let maxVal;
    [index, maxVal] = this.getStartingindexAndValue(inputs);

    let selectedContig = inputs[index];;
    this.showCurrentStepMsg('contig ' + selectedContig);
    let currentIndex = index; 

  for (i=0; i<origInputLength; i++) {
    inputs.splice(currentIndex,1);
    currInputLength = inputs.length;
    this.showCurrentStepMsg('Dlugosc po odjeciu ' + currInputLength);
    this.showCurrentStepMsg('Tablica po odejmowaniu:');
    this.showCurrentStepMsg(inputs);

    overlapArray.push([selectedContig,maxVal]);
    
    // ALR - metoda do znajdywania podobieństw pośród pozostałych kontigów  
    overlaping = this.getOverlapValues(selectedContig, inputs);
    
    this.showCurrentStepMsg('Wartości nakładających sie odczytów:');
    this.showCurrentStepMsg(overlaping);
    
    // ALR - wybór kolejnego kontiga
    [currentIndex, maxVal] = this.getNextContigIndex(overlaping);
    
    let overlapingSample = inputs[currentIndex];
    this.showCurrentStepMsg("nowy contig " + overlapingSample)
    
    selectedContig = overlapingSample;
    overlaping = [];
    index = currentIndex;

  }

  this.showCurrentStepMsg(overlapArray)
 
}

  render(){

    const inputForm = <form id="input-form" onSubmit={this.addItem}>
                      <div className="input-group mb-3">
                          <input type="text" className="form-control" placeholder="Dodaj odczyt" 
                                  aria-label="Dodaj odczyt" aria-describedby="button-addon2" 
                                  value={this.state.currentItem.text} onChange={this.handleInput}></input>
                          <div className="input-group-append">
                              <button className="btn btn-outline-secondary" type="submit" id="button-addon2">Dodaj</button>
                          </div>
                      </div>
                      <div className="text-left mb-2" style={{ fontSize: 13, color: "red" }}>{this.state.lengthError}</div>
                  </form>

      const content = this.state.checked 
      ? <div> Content </div>
      : null;

    const defaultData = this.state.selectedOption == 'option1';
    let list;
    if(defaultData) {
      list = <DefaultInputList defaultInputs={defaultInputs}/>
      } else {
       list =  <div>{inputForm} <InputList items={this.state.items} deleteItem={this.deleteItem}  deleteAll={this.deleteAll}/> </div>
      }
    return (
      <div className="App">
        <div className="container">
          <h1>Graf pokrycia OLC</h1>
          <p>Metody bioinformatyki 20L</p>

          <div className="row">
            <div className="col-lg-4">
            <FormControl component="fieldset">
              <RadioGroup row aria-label="gender" name="gender1">
                <FormControlLabel value="option1" checked={this.state.selectedOption === "option1"} 
                                                  onChange={this.handleOptionChange} control={<Radio color="primary"/>} label="Dane domyślne"/>
                <FormControlLabel value="option2" checked={this.state.selectedOption === "option2"} 
                                                  onChange={this.handleOptionChange} control={<Radio color="primary"/>} label="Wprowadź swoje dane" />
              </RadioGroup>
            </FormControl>
            <div className="row">
            <div className="col-lg-12"> 
              {list}
              <Button variant="contained" color="primary" onClick={this.findSequence}>Rozpocznij</Button>
            </div> 
          </div>
            </div>
            <div className="col-lg-8">
            <GraphOlc nodes={this.state.nodes}
                      edges={this.state.edges}></GraphOlc>
            </div>
          </div>
          
          
        </div>              
      </div>
      
    );
    
  }
}

export default App;
