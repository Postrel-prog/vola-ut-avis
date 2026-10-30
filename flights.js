import { flights, cityNames } from "./flights-data.js";

const fromCity = document.querySelector("#select-from");
const toCity = document.querySelector("#select-to");
const dateInput = document.querySelector("#date-input");
const numPasseng = document.querySelector("#num-passeng");
const formToSearch = document.querySelector("#form-to-search");
const placeForError = document.querySelector("#error-text");
const ulForFilter = document.querySelector("#ul-for-filter");
const endStepWindow = document.querySelector("#showEndStep");
const closeEndWindow = document.querySelector(".close-end-step");
const placeForEndText = document.querySelector("#placeForEndText");

formToSearch.addEventListener("submit", (event) => {
    event.preventDefault();
    placeForError.textContent = "";
    ulForFilter.textContent = "";
    const numPassengNumber = Number(numPasseng.value);
    const fromCityText = fromCity.value;
    const toCityText = toCity.value;
    const dateInputValue = dateInput.value;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const chosenDay = new Date(dateInputValue + "T00:00:00");

    if(!Number.isInteger(numPassengNumber) || numPassengNumber < 1 || numPassengNumber > 6)
    {
        return placeForError.textContent = "Enter a whole number of passengers from 1 to 6.";
    };
    if(fromCityText === toCityText){
       return placeForError.textContent = "Choose different departure and arrival cities.";
    };
    if(today > chosenDay){
        return placeForError.textContent = "Choose today or a future departure date.";
    };

    const filteredArray = filter(fromCityText, toCityText, flights);
    showToSite(filteredArray, ulForFilter, dateInputValue, numPassengNumber);
})

function filter(fromInput, toInput, array){
    const whatUNeed = array.filter(({from, to}) => {return fromInput === from && toInput === to;});
    return whatUNeed;
};

function showToSite(array, wereShow, dateInputValue, numPassengNumber){
    wereShow.textContent = "";
    const departureDate = dateInputValue;
    const passengers = numPassengNumber;
    if(array.length === 0){
        return placeForError.textContent = "No flights found for this route."
    }
    array.forEach((flight) => {

    const liForUl = document.createElement("li");
    liForUl.className = "liForSite";
    
    const idSpan = document.createElement("span");
    idSpan.className = "idSpan";
    idSpan.append(`Flight number: ${flight.id}`)

    const timeToFlightSpan = document.createElement("span");
    timeToFlightSpan.className = "timeToFlightSpan";
    timeToFlightSpan.append(`Departure:\u00A0${flight.departure} → Arrival:\u00A0${flight.arrival}`)

    const priceSpan = document.createElement("span");
    priceSpan.className = "priceSpan";
    priceSpan.append(`${flight.price}\u00A0EUR\u00A0/\u00A0passenger`)

    const chosenFlight = document.createElement("button");
    chosenFlight.className = "chosenFlightButton";
    chosenFlight.type = "button";
    chosenFlight.textContent = "Select flight";
    chosenFlight.addEventListener("click", () => {
        showToModal(flight, departureDate, passengers, placeForEndText)
        endStepWindow.showModal();
    })

    liForUl.append(idSpan, timeToFlightSpan, priceSpan, chosenFlight);
    wereShow.append(liForUl);});
}

closeEndWindow.addEventListener("click", () => endStepWindow.close());

function showToModal(flight, date, numPasseng, wereShow){
    wereShow.textContent = "";
    const selectedDate = new Date(date + "T00:00:00");
    const trueStringData = selectedDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });


    const pId = document.createElement("p");
    const spanId = document.createElement("span");
    spanId.className = "summary-label";
    spanId.append("Flight:");
    pId.className = "pEndStep";
    pId.append(spanId, `\u00A0${flight.id}`);

    const pRoute = document.createElement("p");
    const spanRoute = document.createElement("span");
    spanRoute.className = "summary-label";
    spanRoute.append("Route:");
    pRoute.className = "pEndStep";
    pRoute.append(spanRoute, `\u00A0${cityNames[flight.from]} → ${cityNames[flight.to]}`);

    const pData = document.createElement("p");
    const spanData = document.createElement("span");
    spanData.className = "summary-label";
    spanData.append("Date:");
    pData.className = "pEndStep";
    pData.append(spanData, `\u00A0${trueStringData}`);

    const pDepartureArrival = document.createElement("p");
    const spanDepartureArrival = document.createElement("span");
    spanDepartureArrival.className = "summary-label";
    spanDepartureArrival.append("Departure\u00A0/\u00A0Arrival:");
    pDepartureArrival.className = "pEndStep";
    pDepartureArrival.append(spanDepartureArrival, `\u00A0${flight.departure}\u00A0/\u00A0${flight.arrival}`);

    const pPasseng = document.createElement("p");
    const spanPasseng = document.createElement("span");
    spanPasseng.className = "summary-label";
    spanPasseng.append("Passengers:");
    pPasseng.className = "pEndStep";
    pPasseng.append(spanPasseng, `\u00A0${numPasseng}`);

    const pTotal = document.createElement("p");
    pTotal.className = "pEndStep summary-total";
    pTotal.append(`Total:\u00A0${flight.price*numPasseng}\u00A0EUR`);

    wereShow.append(pId, pRoute, pData, pDepartureArrival, pPasseng, pTotal)
}
