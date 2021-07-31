// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];
let catObjects = [];
let API_BASE = 'https://jservice.io/api/'; 
let NUM_CATEGORIES = 6;
let NUM_QUESTIONS_PER_CAT = 5;


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
    //get a 100(max) categs.from the API
    let responseAPI = await axios.get(`${API_BASE}categories?count=100`);
    catIds = responseAPI.data.map(cat => cat.id);
    /** -.sampleSize() will return an array such as: [xxxx,xxxx,xxxxx,xxxxx,xxxx,xxxxx]  
    each 'xxxxx' being six random category ID numbers **/
    catId = _.sampleSize(catIds, NUM_CATEGORIES); 
    return catId;
  }

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
  let selectedClues = '';
  let catResponse = '';

  for (let i=0; i<NUM_CATEGORIES; i++) {
    let responseAPI = await axios.get(`${API_BASE}category?id=${catId[i]}`);
    catResponse = responseAPI.data; 
    let catClues = catResponse.clues; 
    let catCluesRandom = _.sampleSize(catClues, NUM_QUESTIONS_PER_CAT)
    selectedClues = catCluesRandom.map(clues => ({
      question: clues.question, 
      answer: clues.answer,
      showing: null
    }));
    categories.splice(0,0, catResponse.title);
    catObjects.splice(0,0, selectedClues);
    }
  
    
    return
    
  
} 

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {

  //create table and child elements
  let body = document.querySelector('body');
  let table = document.createElement('table');
  table.classList.add('jeopardy-table');
  body.appendChild(table);
  
   //for-loop to create categories row at the top of the Table

  function fillHeader() {
    let thead = document.createElement('thead');
    table.appendChild(thead);
    tr = document.createElement('tr')
    tr.id = "header-row";
    thead.appendChild(tr);
    
    for(let catHeadRow=0; catHeadRow<NUM_CATEGORIES; catHeadRow++) {
      let td = document.createElement('td');
      td.id = 'header-data'
      tr.appendChild(td).innerText = categories[catHeadRow].toUpperCase();
    };
  };


  function fillBody() {
    let tbody = document.createElement('tbody');
    table.appendChild(tbody);
    /// catObjects[x][y] ====> 'x' being the category and 'y' being the number of the question in the category
    for (let clue=0; clue<NUM_QUESTIONS_PER_CAT; clue++) {
      tr = document.createElement('tr');
      tr.id = "body-row";
      
      for(let cat=0; cat<NUM_CATEGORIES; cat++) {
        let td = document.createElement('td');
        td.id = `${cat}-${clue}`;
        tr.appendChild(td).innerText = '?'
        //catObjects[cat][clue].question;
                       
      };
    tbody.appendChild(tr);
    };  
  };
  return (fillHeader(), fillBody());
}




/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
  
  let cellId = evt.target.id; 
  
  let [cat, catClue] = cellId.split('-'); //[0-0]
  
  let clue = catObjects[cat][catClue]; 

  let signalDOM = '';

  // question: clues.question, 
  // answer: clues.answer,
  // showing: null

  if (clue.showing === null) { //if null, means that the question mark is showing and has not been clicked
    signalDOM = clue.question; //grabs 'question' value from the object 
    clue.showing = 'question' // Overwrites the 'showing' property value to the same value as the 'question' property
  
  } else if (clue.showing === 'question') { //Means that the item has already been clicked
    signalDOM = clue.answer; //grabs 'answer' value from the object
    clue.showing = 'answer' //Overwrites the 'showing' property value to the same as the 'answer' propert
  
  } else { // If the clue.showing property is === 'answer', then it does nothing and remains as is, even if clicked. 
    return
  }
  
  //cell id will be updated
  document.getElementById(`${cellId}`).innerHTML = signalDOM // overwrites the DOM's <td> text childs with the appropriate text
  
}



/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

  $('body').append('<div class="spinner-grow"  role="status">');
  return
}
/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
  $(".spinner-grow").remove();
  
}

  
  





/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
  $(".jeopardy-table").empty(); 
  await getCategoryIds(); 
  await getCategory(catId); 
  fillTable();
  hideLoadingView(); 
  $( "td" ).on( "click", handleClick );
};



/** On click of start / restart button, set up game. */

let button = document.querySelector('button');
button.onclick = function() {
  return (setupAndStart(), showLoadingView())
}

/** On page load, add event handler for clicking clues */
  





  
