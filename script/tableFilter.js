
setTimeout(function(){
  tableBody = document.querySelector("tbody");
  stateSelection = document.querySelector("#stateSelect");
  addressFilter = document.querySelector("input[name='addressFilter']");
  addressFilter.addEventListener("input", filterTableOnAddresses);
  stateSelection.addEventListener("change", filterStates);
  
  //Set a constant that contains the initial elments and ordering used for resetting
  const tableBodyChildrenInitial = Array.from(tableBody.children);
  
  resetFilterButton = document.querySelector("#resetFilterButton");
  //Reset all of the filtering and sorting
  resetFilterButton.addEventListener("click", function(){
    stateSelection.selectedIndex = 0;
    addressFilter.value = "";
    toggleElementChildren(tableBody, tableBodyChildrenInitial);
    toggleElementChildren(tableBody, tableBodyChildrenInitial);
    filterTableOnAddresses();
    removeAllSortIcons();
  });
}, 3000);
//Initialize needed document elements


//Object to keep track of the sorted elements and their properties
var tableSortedObject = {
  'held':
    {
      'index': 0,
      'asc': false,
      'column': 2,
      'rowClass': '.balance',
      'soted': false
    },
  'threshold':
    {
      'index': 1,
      'asc': false,
      'column': 2,
      'rowClass': '.commitThreshold',
      'sorted': false
    },
  'deposited':
    {
      'index': 2,
      'asc': false,
      'column': 2,
      'rowClass': '.fundsDeposited',
      'sorted': false
    },
  'burned':
    {
      'index': 3,
      'asc': false,
      'column': 3,
      'rowClass': '.fundsBurned',
      'sorted': false
    },
  'released':
    {
      'index': 4,
      'asc': false,
      'column': 3,
      'rowClass': '.fundsReleased',
      'sorted': false
    }
}

//Array to store rows of table, that are temporarily filtered on stateSelection
var filteredTableRows = [];
////////////////////////////////////////////////////////////////////////////////
//This is the code for filtering on addresses in column 2


function filterTableOnAddresses(){
  //get current table elements
  var tableBodyChildrenArray = Array.from(tableBody.children);
  //iterate through each element that is currently in the table and check if one of its addresses starts with the search string
  tableBodyChildrenArray.forEach(function(child){
    var contractAddressString = child.querySelector(".contractAddress").innerText.trim();
    var payerAddressString = child.querySelector(".payerAddress").innerText.trim();
    var recipientAddressString = child.querySelector(".recipientAddress").innerText.trim();

    if(!contractAddressString.startsWith(String(addressFilter.value.trim()))
    && !payerAddressString.startsWith(String(addressFilter.value.trim()))
    && !recipientAddressString.startsWith(String(addressFilter.value.trim()))){
      child.style.display = 'none';
    }
    else{
      child.style.display = 'table-row';
    }
  });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//This is the code for sorting the table in column 3 & 4

//EventListener that listens for click event on the whole page
//If one of the sorting elements is clicked a function is executed sorting the table according to the clicked value
document.addEventListener("click", function(event){
  //get current table elements
  var tableBodyChildrenArray = Array.from(tableBody.children);
  //get the clicked element
  var targetElement = event.target;
  //check whether clicked element is relevant for sorting
  if(targetElement.id in tableSortedObject){
    console.log(event);
    var selectedObject = tableSortedObject[targetElement.id];
    prepareSorting(targetElement);
    removeAllSortIcons();
    addSortIcon(selectedObject['asc'], selectedObject['index']);
    sortElements(tableBodyChildrenArray, 0, tableBodyChildrenArray.length - 1, selectedObject['rowClass'], selectedObject['asc']);
    toggleElementChildren(tableBody, tableBodyChildrenArray);
    toggleElementChildren(tableBody, tableBodyChildrenArray);
  }
});

//"prepares" sorting through checking if table is sorted already and if ascending or descending
function prepareSorting(targetElement) {
      var result = true;
      //check whether anything is sorted already
      for (var i in tableSortedObject) {
          if (tableSortedObject[i]['sorted'] === true) {
              result = false;
              break;
          }
      }
      //if table isn't sorted already, against what the table will be sorted is saved and sorting order is reversed
      if(result){
        tableSortedObject[targetElement.id]['sorted'] = true;
        tableSortedObject[targetElement.id]['asc'] = !tableSortedObject[targetElement.id]['asc'];
      }
      //if table is sorted already but on another element than the one that was clicked, the new sorting element is saved and order reversed
      else if(!tableSortedObject[targetElement.id]['sorted']){
        for (var key in tableSortedObject) {
            // skip loop if the property is from prototype
            if (!tableSortedObject.hasOwnProperty(key)) continue;
            tableSortedObject[key]['sorted'] = false;
            tableSortedObject[key]['asc'] = false;
        }
        tableSortedObject[targetElement.id]['sorted'] = true;
        tableSortedObject[targetElement.id]['asc'] = !tableSortedObject[targetElement.id]['asc'];
      }
      //if table is sorted on the same element as before, only the order of sorting is reversed
      else{
        tableSortedObject[targetElement.id]['asc'] = !tableSortedObject[targetElement.id]['asc'];
      }
}

//removes all icons for sorting
function removeAllSortIcons(){
  var icons = Array.from(document.querySelectorAll(".sortable"));
  icons.forEach(function(element){
    element.children[0].classList.remove("fa-sort-asc");
    element.children[0].classList.remove("fa-sort-desc");
  });
}

//add icon that marks on what element the table is sorted and what order
function addSortIcon(addAscIcon, iconIndex){
  var icon = document.querySelectorAll(".sortable")[iconIndex].children[0];
  if(addAscIcon){
    icon.classList.add("fa-sort-desc");
    icon.classList.remove("fa-sort-asc");
  }
  else{
    icon.classList.add("fa-sort-asc");
    icon.classList.remove("fa-sort-desc");
  }
}

//deletes all children of a given array if it has any, otherwise it populates it with the elements of a given array
function toggleElementChildren(parent, elementArray){
  if(parent.children.length === 0){
    elementArray.forEach(function(element){
      parent.appendChild(element);
    });
  }
  else if(parent.children.length > 0){
    elementArray.forEach(function(element){
      element.remove();
    });
  }
}

//sorts a given array of elements with a quicksort implementation either ascending or descending
function sortElements(elementArray, left, right, valueToSortClass, ascending){
   var len = elementArray.length,
   pivot,
   partitionIndex;

  if(left < right){
    pivot = right;
    partitionIndex = partition(elementArray, pivot, left, right, valueToSortClass, ascending);

   //sort left and right
   sortElements(elementArray, left, partitionIndex - 1, valueToSortClass, ascending);
   sortElements(elementArray, partitionIndex + 1, right, valueToSortClass, ascending);
  }
}

//part of the quicksort algortithm to sort the halves
function partition(elementArray, pivot, left, right, valueToSortClass, ascending){
   var pivotValue = elementArray[pivot].querySelector(valueToSortClass).innerText.trim(),
       partitionIndex = left;
   for(var i = left; i < right; i++){
    if(elementArray[i].querySelector(valueToSortClass).innerText.trim() < pivotValue && ascending){
      swap(elementArray, i, partitionIndex);
      partitionIndex++;
    }
    else if(elementArray[i].querySelector(valueToSortClass).innerText.trim() < pivotValue && !ascending){
      swap(elementArray, partitionIndex, i);
      i++;
    }
  }
  swap(elementArray, right, partitionIndex);
    return partitionIndex;
}

//part of the quicksort algorithm to swap two elements
function swap(arr, i, j){
   var temp = arr[i];
   arr[i] = arr[j];
   arr[j] = temp;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//This is the code for filtering different states in column one

//adding event listener to the selection element that calls the filterStates function on a change

//transfers all state flitered entries from the filteredTableRows array back into the table
function restoreStateFilteredRows(){
  filteredTableRowsLength = filteredTableRows.length;
  for(var counter = 0; counter < filteredTableRowsLength; counter++){
    var childToBeAdded = filteredTableRows.pop();
    childToBeAdded.style.display = "table-row";
    tableBody.appendChild(childToBeAdded);
  }
}

//puts all rows that match a given state into the filteredTableRows array
function hideState(stateString){
  var firstCol= document.querySelectorAll(".state");
  firstCol.forEach(function(element){
    if(element.innerText.trim() === stateString){
      filteredTableRows.push(element.parentNode);
      element.parentNode.parentNode.removeChild(element.parentNode);
    }
  });
}

//executes all needed functions to change the state filter seettings
function filterStates(){
  stateSelected = stateSelection.options[stateSelection.selectedIndex].value;
  switch(stateSelected){
    case "All":
      restoreStateFilteredRows();
      break;
    case "Open_Committed":
      restoreStateFilteredRows();
      hideState("Expended");
      break;
    case "Open":
      restoreStateFilteredRows();
      hideState("Expended");
      hideState("Committed");
      break;
    case "Committed":
      restoreStateFilteredRows();
      hideState("Expended");
      hideState("Open");
      break;
    case "Expended":
      restoreStateFilteredRows();
      hideState("Open");
      hideState("Committed");
      break;
  }

  filterTableOnAddresses();

  //sorts the entries on sorting criteria already chosen
  var tableBodyChildrenArray = Array.from(tableBody.children);
  var targetElement;
  for(var key in tableSortedObject){
    if(!tableSortedObject.hasOwnProperty(key)){
      continue;
    }
    else if(tableSortedObject[key]['sorted']){
      targetElement = tableSortedObject[key];
      break;
    }
  }
  if(typeof targetElement !== "undefined"){
    sortElements(tableBodyChildrenArray, 0, tableBodyChildrenArray.length - 1, targetElement['rowClass'],targetElement['asc']);
    toggleElementChildren(tableBody, tableBodyChildrenArray);
    toggleElementChildren(tableBody, tableBodyChildrenArray);
  }
}
