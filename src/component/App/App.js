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

// ALR nie jestem pewien czy koniecznie podoba mi się ta implementacja jako słownik,
// z punktu widzania tworzenia kodu jest, szczególnie bez kontroli typów, błędogenna
const defaultInputs = [
  {text:'AAABA'},
  {text:'ABAAB'},
  {text:'BAABA'},
  {text:'AABAB'}
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
        items: defaultInputs,
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
    this.resetGraph = this.resetGraph.bind(this);
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
      // ALR: w związku ze zmianami w strukturze przechowujacej dane węzłów należy zmienić ich obsługę i wyciągać
      // je jako .text ze słownika
      //overlaping[j] = this.findOverlapLength(_selectedContig, _inputs[j]);
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
  inputs = this.state.items.map((item) => item.text);
  //JP Kopia tablicy wejściowej - potrzebna do ustalenia kolejności krawędzi
  const initialData = [...inputs]

  /* JP nie jest to potrzebne, bo dane pobieramy ze stanu 
  //Przypisanie tablicy w zależności od wybranego radiobuttona
  const defaultData = this.state.selectedOption == 'option1';
  if(defaultData){
    // ewentualnie użyć slice(0) aby zrobić płytką kopię
    inputs = [...defaultInputs];
  }
   else {
    inputs = [...myInputs];
  } */
  this.showCurrentStepMsg("Dane wejsciowe");
  this.showCurrentStepMsg(inputs);

  let origInputLength = inputs.length;// ALR refaktor, jakbyśmy zdecydowali się coś zmienić, to w jednym miejscu lepiej zmieniać długosć
  this.showCurrentStepMsg('Długość wejściowa ' + origInputLength);
  let currInputLength = origInputLength; // ALR : informacja o bieżącej długości tablicy z podsekwencjami, na użytek pętli

  let i;
  let j;
  let overlaping = []
  let orderOfEdges = []

  // macierz nxn przechowująca wagi krawędzi między grafami, 
  // czyli długości nakładających się fragmentów obu sekwencji.
  let overlapArray = [];
 
    //Pobranie indeksu startowego odczytu oraz inicjalizacja zmiennej maxValue
    let index;// ALR zastanowić się czy ta zmienna nie jest zbędna i nie wystarczy currentIndex sam
    let maxVal;
    [index, maxVal] = this.getStartingindexAndValue(inputs);

    let selectedContig = inputs[index];
    this.showCurrentStepMsg('contig ' + selectedContig);
    let currentIndex = index; 

    let edge = initialData.indexOf(selectedContig) + 1;
    orderOfEdges.push(edge)
   

  for (i=0; i<origInputLength; i++) {
    inputs.splice(currentIndex,1);
    
    currInputLength = inputs.length;
    this.showCurrentStepMsg('Dlugosc po odjeciu ' + currInputLength);
    this.showCurrentStepMsg('Tablica po odejmowaniu:');
    this.showCurrentStepMsg(inputs);

   

    // ALR zmiana spowodowana zmianami w inputs
    //overlapArray.push([selectedContig,maxVal]);
    //JP przywracam do wczesniejszego stanu bo na 
    //początku robimy mapowanie i pozbywamy się innych kluczy
    overlapArray.push([selectedContig,maxVal]);
    

    // ALR - metoda do znajdywania podobieństw pośród pozostałych kontigów  
    // overlaping zawiera dane nakładania się tylko dla bieżącego węzła
    overlaping = this.getOverlapValues(selectedContig, inputs);
    this.showCurrentStepMsg('Wartości nakładających sie odczytów:');
    this.showCurrentStepMsg(overlaping);
    
    // ALR - wybór kolejnego kontiga
    [currentIndex, maxVal] = this.getNextContigIndex(overlaping);
    
    let overlapingSample = inputs[currentIndex];
    this.showCurrentStepMsg("nowy contig " + overlapingSample)
   
    edge = initialData.indexOf(overlapingSample) + 1;
    orderOfEdges.push(edge)
  
    
    selectedContig = overlapingSample;
    overlaping = [];
    index = currentIndex;// ALR zastanowić się czy ta zmienna nie jest zbędna i nie wystarczy currentIndex sam

  }

  this.showCurrentStepMsg(overlapArray)

  //JP stworzenie tablicy przechowującej obiekty krawędzi z kluczami from i to
  let finalOrderOfEdges = []

  for (let k=0; k<orderOfEdges.length-2; k++){
    let element = {}
    element.from = orderOfEdges[k];
    element.to = orderOfEdges[k+1]
    finalOrderOfEdges.push(element)
  }
 
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
            </div> 
          </div>
            </div>
            <div className="col-lg-7 offset-lg-1">
            <GraphOlc items={this.state.items}
                      edges={this.state.edges}>
            </GraphOlc>
            </div>
          </div>
          
          
        </div>              
      </div>
      
    );
    
  }
}

export default App;
