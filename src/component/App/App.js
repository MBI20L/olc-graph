import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import './App.css';
import InputList from '../InputList/InputList';
import DefaultInputList from '../InputList/DefaultInputList';
import OlcGraph from '../OlcGraph/OlcGraph'


library.add(faTrash)

const defaultInputs = [
  'AAABA',
  'ABAAB',
  'BAABA',
  'AABAB'
];

// Klasa do zbierania kolejnych kroków algorytmu, do użycia i wywołania w oddzielnych implementacjach
class History {

    constructor(_algorithmName){
      this.algorithmName = _algorithmName;
        // Tablica przechowująca indeksy kolejnych pobieranych podsekwencji
        // TODO: rozważyć w zależności od implementacji, czy nie zaimplementować informacji o rodzaju kroku/komentarzu
      this.steps         = new Array();
        
    }

    addStep(_step){
      this.steps.push(_step);
    }

    recall(){
      //TODO : wypisanie historii

    }

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
        lengthError: ''
    }
    this.handleInput = this.handleInput.bind(this);
    this.addItem = this.addItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.deleteAll = this.deleteAll.bind(this);
    this.callFindOverlap = this.callFindOverlap.bind(this);
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
callFindOverlap(){


  let inputs =[];

  //Pobranie danych wpisywanych ręcznie
  const myInputs = this.state.items.map((item) => item.text);

  //Przypisanie tablicy w zależności od wybranego radiobuttona
  const defaultData = this.state.selectedOption == 'option1';
  if(defaultData){
    inputs = defaultInputs;
  } else {
    inputs = myInputs;
  }
  console.log("Dane wejsciowe");
  console.log(inputs);

  let inputLength = inputs.length;// ALR refaktor, jakbyśmy zdecydowali się coś zmienić, to w jednym miejscu lepiej zmieniać długosć
  console.log("aaa");
  console.log(inputs.content);

  let i;
  let j;
  // macierz nxn przechowująca wagi krawędzi między grafami, 
  // czyli długości nakładających się fragmentów obu sekwencji.
  let overlapArray = new Array(inputLength);
  console.log(overlapArray);
  
  // Wpierw uzupełniamy macierz nakładania się 0 i 
  // Miarą nakładania się sekwencji.
  for(i=0; i < inputLength; i++){
    overlapArray[i] = new Array (inputLength);
    overlapArray[i].fill(0);
    for(j=i+1; j < inputLength; j++){
      let output = this.findOverlapLength(inputs[i], inputs[j] );
      overlapArray[i][j] = output;
      console.log(output);
    }
  }
  console.log(overlapArray);
  // Następnie przechodzimy po macierzy sekwencji, zaczynając od rekordu,
  // Od którego wpierw zaczęliśmy tworzenie macierzy nakładania.
  // Następnie przechodzimy po kolejnych sekwencjach, które najbardziej się
  // nakładają. Wypisujemy po kolei kolejne podsekwencje. 
  // Dodać randomizację indeksu, a następnie uwzględnić kilka róznych przejść jeśli wybrany indeks nie zwraca ok wartości
  let index = 0; 
  let orderArray = new Array(inputLength);
  
  for(i=0; i< inputLength-1; i++){
    
    console.log("Iteracja " + i)
    
    let maxVal = Math.max.apply(Math, overlapArray[index]);
    let currentIndex = overlapArray[index].indexOf(maxVal);
    
    console.log("Max nakładanie " + maxVal);
    
    let nextMaxVal = Math.max.apply(Math, overlapArray[currentIndex]);
   
    // Proste sprawdzenie na wypadek skrajnego przypadku, gdyby z następnego
    // węzła nie można było przejść nigdzie dalej. 
    if(!nextMaxVal && i != inputLength-2) {
      console.log("Obsługa ślepego zaułka");
      overlapArray[index][currentIndex] = 0;
      maxVal = Math.max.apply(Math, overlapArray[index]); 
      currentIndex = overlapArray[index].indexOf(maxVal);
      console.log("Second max " + maxVal +' '+ currentIndex);
    }
    // Dodanie kolejnego kroku oraz wartości nakładania w kroku.
    orderArray[i] = [currentIndex, maxVal];

    console.log("current " + currentIndex);
    index = currentIndex;
    // Dla celów testowych wypisanie kolejnych kroków algorytmu.
    console.log(inputs[index]);
    
  }
  // TODO: utworzenie metody która na podstawie macierzy kroków
    // pełnej sekwencji. Będziemy dodawać kolejne podsekwencje (o indeksach 
    // wskazanych w orderArray), ale bez pierwszych maxVal znaków. 

  console.log(orderArray);
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
              <Button variant="contained" color="primary" onClick={this.callFindOverlap}>Rozpocznij</Button>
            </div> 
          </div>
            </div>
          </div>
          
          
        </div>              
      </div>
    );

  }
}

export default App;
