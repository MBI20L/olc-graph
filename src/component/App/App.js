import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import InputList from '../InputList/InputList';
import DefaultInputList from '../InputList/DefaultInputList';
import GraphOlc from '../GraphOlc/GraphOlc';


library.add(faTrash)
// Wartości domyślne
const defaultInputs = [
  {text:'AAABA'},
  {text:'ABAAB'},
  {text:'BAABA'},
  {text:'AABAB'}
];

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        selectedOption: "option1",
        items: defaultInputs,
        currentItem: {
            text:'',
            key: ''
        },
        lengthError: '', 
        nodes: [],// ALR zmienne do przechowywania danych grafu
        edges: [],
        finalOrderOfEdges: [], //wszystkie ustalone krawędzie, na potrzeby historii
        finalSequence: '',
        isResult: false
       
    }
    this.handleInput = this.handleInput.bind(this);
    this.addItem = this.addItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.deleteAll = this.deleteAll.bind(this);
    this.findSequence = this.findSequence.bind(this);
    this.getStartingindexAndValue = this.getStartingindexAndValue.bind(this);
    this.getOverlapValues = this.getOverlapValues.bind(this);
    this.getNextContigIndex = this.getNextContigIndex.bind(this);
    this.resetGraph = this.resetGraph.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.addEdgesToGraph = this.addEdgesToGraph.bind(this);
    this.updateFinalSequence = this.updateFinalSequence.bind(this);
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

  if (this.state.items[0] === undefined){
    return true;
  } else if (this.state.currentItem.text.length !== this.state.items[0].text.length) {
    console.log("Wymiar " + this.state.currentItem.text.length)
    console.log("Wymiar " + this.state.items[0].text.length)
    lengthError = 'Odczyty muszą mieć te same wymiary! Wprowadź daną ponownie.';
    this.setState({lengthError});
    return false;
  } 

  return true;
} 

addItem(e){
    e.preventDefault();
    const isValid = this.validate();
    if (isValid) {
      const newItem = this.state.currentItem;
      if(newItem.text !== ''){
          const newItems = [...this.state.items, newItem];
          this.setState({
              items: newItems,
              currentItem: {
                  text: '',
                  key: ''
              },
          })
      }
      
    } else{
      this.setState({
        currentItem: {
          text: ''
        }
      })
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
    items: [],
    edges: []
  })
}

handleOptionChange = changeEvent => {
  this.setState({
    selectedOption: changeEvent.target.value,
    edges: []
  });

  if(changeEvent.target.value == 'option2'){
    this.setState({
      items: []
    });
  } else {
    this.setState({
      items: defaultInputs
    });

  }
};

resetGraph(){
  this.setState({
    edges: []
  })
}

//ALR: przedstawienie kolejnej krawędzi grafu
handleNext(){
  if (this.state.edges.length < this.state.finalOrderOfEdges.length){
    let newEdges = [...this.state.edges];
    newEdges.push(this.state.finalOrderOfEdges[newEdges.length]);
    this.setState({edges: newEdges});
  }
}

//ALR cofnięcie historii
handlePrev(){
  if(this.state.edges){
    let newEdges = [...this.state.edges];
    newEdges.pop();
    this.setState({edges: newEdges})
  }
}


// Metoda zwracająca nakładający się fragment dwóch sekwencji.
 findOverlap(a, b) {
   
  if (b.length === 0) {
    return "";
  }

  if (a.endsWith(b)) {
    return b;
  }
  return this.findOverlap(a, b.substring(0, b.length - 1));  
}

// Metoda zwracająca długość nakładającego się fragmentu dwóch sekwencji.
findOverlapLength(a,b) {
  return this.findOverlap(a, b).length;
}

// Implementacja algorytmu zachłannego 

// ALR funkcja do ustalania indeksu startowej sekwencji 
getStartingindexAndValue(_inputs){
  // index - indeks startowego odczytu
  //let index = Math.floor(Math.random() * _inputs.length);
  let index = 0;
  let maxVal = 0;
  
  return [index, maxVal]
}

// ALR - funkcja do wyliczania nakładań na sekwencje wskazane w _inputs względem wybranej
// sekwencji _selectedContig. 
getOverlapValues(_selectedContig, _inputs){
  let j;
  let overlaping = [];
  for(j=0; j<_inputs.length; j++){
    overlaping[j] = this.findOverlapLength(_selectedContig, _inputs[j]);
  }
  return overlaping;
}

// ALR: wyszukanie kolejnej podsekwencji do dodania do głównej sekwencji,
// na podstawie informacji o wartościach nakładania się.
// Zwraca wartosść maksymalną oraz indeks wskazujący na rekord w tablicy z pozostałymi podsekwencjami.
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

// ALR wypisywanie informacji o bieżącym działaniu.
showCurrentStepMsg(_msg){
  if (typeof _msg === 'object'){
    _msg = JSON.stringify(_msg)
  }
  document.getElementById('output-message').innerHTML += _msg + '</br>';
  console.log(_msg)  
}

findSequence(){
  //JP czyszczenie wyświetlanych komunikatów
  document.getElementById('output-message').innerHTML = '';
  this.setState({
    isResult: true
  })
  this.setState({edges:[], finalOrderOfEdges:[], finalSequence: ''});
  let inputs =[];
  //Pobranie danych
  inputs = this.state.items.map((item) => item.text);
  //JP Kopia tablicy wejściowej - potrzebna do ustalenia kolejności krawędzi
  const initialData = [...inputs]

  this.showCurrentStepMsg("Startowe podsekwencje:");
  this.showCurrentStepMsg(inputs);

  let origInputLength = inputs.length;
  this.showCurrentStepMsg('Rozmiar tablicy z podsekwencjami: ' + origInputLength);
  let currInputLength = origInputLength; // ALR : informacja o bieżącej długości tablicy z podsekwencjami, na użytek pętli

  let i;
  let j;
  // Tablica overlaping zawiera wartości nakładania się pozostałych do analizy węzłów względem bieżąco analizowanego.
  let overlaping = []
  let orderOfEdges = []

  // Macierz przechowująca kolejno wybrane przez algorytm węzły, łącznie z ich oceną.
  let overlapArray = [];
 
    //Pobranie indeksu startowego odczytu oraz inicjalizacja zmiennej maxValue
    let index;
    let maxVal;
    [index, maxVal] = this.getStartingindexAndValue(inputs);

    let selectedContig = inputs[index];
    this.showCurrentStepMsg('Startowy kontig: ' + selectedContig);
    let currentIndex = index; 

    let edge = initialData.indexOf(selectedContig) + 1;
    orderOfEdges.push(edge)
      
  for (i=0; i<origInputLength-1; i++) {
    this.updateFinalSequence(selectedContig, maxVal);
    inputs.splice(currentIndex,1);
    currInputLength = inputs.length;
    this.showCurrentStepMsg('Ilość pozostałych podsekwencji: ' + currInputLength);
    this.showCurrentStepMsg('Pozostałe podsekwencje:');
    this.showCurrentStepMsg(inputs);

    overlapArray.push([selectedContig,maxVal]);
    

    // ALR - metoda do znajdywania podobieństw pośród pozostałych kontigów  
     overlaping = this.getOverlapValues(selectedContig, inputs);
    this.showCurrentStepMsg('Wartości nakładania się kolejnych odczytów:');
    this.showCurrentStepMsg(overlaping);
    
    // ALR - wybór kolejnego kontiga
    [currentIndex, maxVal] = this.getNextContigIndex(overlaping);
    
    // ALR uwzględnienie sytuacji, że nie ma już pasujących sekwencji
    if (maxVal == 0)
    {
      this.showCurrentStepMsg("Brak pasujących sekwencji!")
      break;  
    }
    
    let overlapingSample = inputs[currentIndex];
    this.showCurrentStepMsg("Kontig o największej wartości nakładania: " + overlapingSample)
       
    edge = initialData.indexOf(overlapingSample) + 1;
    orderOfEdges.push(edge)
    
    selectedContig = overlapingSample;
    overlaping = [];
  }
  this.updateFinalSequence(selectedContig, maxVal);  
  //JP stworzenie tablicy przechowującej obiekty krawędzi z kluczami from i to
  this.addEdgesToGraph(orderOfEdges);
  this.showCurrentStepMsg("Pełna sekwencja: " + this.state.finalSequence)
}

//JP stworzenie tablicy przechowującej obiekty krawędzi z kluczami from i to
addEdgesToGraph(_orderOfEdges){
  let finalOrderOfEdges = []
  this.showCurrentStepMsg(_orderOfEdges);
  for (let k=0; k<_orderOfEdges.length-1; k++){
    let element = {};
    element.from = _orderOfEdges[k];
    element.to = _orderOfEdges[k+1]
    finalOrderOfEdges.push(element)
  }
  this.setState({
    edges: finalOrderOfEdges, finalOrderOfEdges : finalOrderOfEdges}); 
}

// ALR na bieżąco tworzenie nowej sekwencji
updateFinalSequence(_newContig, _overlapValue){
  let finalSeqTmp = this.state.finalSequence;
  finalSeqTmp += _newContig.substring(_overlapValue)
  this.setState({finalSequence: finalSeqTmp})
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
  
    const defaultData = this.state.selectedOption === 'option1';
    let list;
    if(defaultData) {
      list = <DefaultInputList items={this.state.items}/>
      } else {
       list =  <div>{inputForm} <InputList items={this.state.items} deleteItem={this.deleteItem}  deleteAll={this.deleteAll}/> </div>
      }

    const isResult = this.state.isResult;
    let resultMsgHeader;
    if(isResult){
      resultMsgHeader = <p className="text-left header-message">Przebieg algorytmu:</p>    
    }
    return (
      <div className="App">
        <div className="container">
         <div className="mt-3">
            <h1>Graf pokrycia OLC</h1>
            <p>Metody bioinformatyki 20L</p>
          </div>
          <div className="row">
            <div className="col-lg-4 mt-3">
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
              <Button variant="contained" color="primary" className="mr-2" onClick={this.findSequence}>Generuj graf</Button>
              <Button variant="outlined" color="primary" className="ml-2" onClick={this.resetGraph}>Resetuj</Button>

              <Button variant="outlined" color="primary" className="ml-2 mt-4" onClick={this.handleNext}>Następny krok</Button>
              <Button variant="outlined" color="primary" className="ml-2 mt-4" onClick={this.handlePrev}>Poprzedni krok</Button>
            </div> 
          </div>
            </div>
            <div className="col-lg-7 offset-lg-1">
              
            <GraphOlc items={this.state.items}
                      edges={this.state.edges}>
            </GraphOlc>
            </div>
          </div>
          <div className="row">
            <div className="mt-5 col-lg-12">
               {resultMsgHeader}
               <div id="output-message" className="text-left overflow-auto message mb-5"></div>
            </div>
          </div> 
        </div>              
      </div>
      
    );
    
  }
}

export default App;
