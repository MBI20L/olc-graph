// Wpierw uzupełniamy macierz nakładania się 0 i 
  // Miarą nakładania się sekwencji.
 /* for(i=0; i < inputLength; i++){
    overlapArray[i] = new Array (inputLength);
    overlapArray[i].fill(0);
    for(j=i+1; j < inputs.length; j++){
      let output = this.findOverlapLength(inputs[i], inputs[j] );
      console.log('i ' + i);
      console.log('j ' + j);
      overlapArray[i][j] = output;
      console.log('macierz' + overlapArray[i][j]);
      console.log(output);
    }
    
  }
  console.log(overlapArray); 
  
  // Następnie przechodzimy po macierzy sekwencji, zaczynając od rekordu,
  // Od którego wpierw zaczęliśmy tworzenie macierzy nakładania.
  // Następnie przechodzimy po kolejnych sekwencjach, które najbardziej się
  // nakładają. Wypisujemy po kolei kolejne podsekwencje. 
  let index = 0;
  let orderArray = new Array(inputs.length);
  for(i=0; i< inputs.length-1; i++){
    console.log("Iteracja " + i)
    console.log(overlapArray);
    let maxVal = Math.max.apply(Math, overlapArray[index]);
    console.log("Max nakładanie " + maxVal);
    let currentIndex = overlapArray[index].indexOf(maxVal);
    let nextMaxVal = Math.max.apply(Math, overlapArray[currentIndex]);
    console.log('Next max val ' + nextMaxVal)
   
    // Proste sprawdzenie na wypadek skrajnego przypadku, gdyby z następnego
    // węzła nie można było przejść nigdzie dalej. 
    if(!nextMaxVal && i != inputs.length-2) {
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

  console.log(orderArray);*/