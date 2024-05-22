const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwardDisplay = document.querySelector("[data-passwardDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generatebutton")
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
let passward = "";
let passwardLength = 10;
let checkCount = 0;
const symbols = "!#$%&'()*+,-:;<=>?@[/]^_`{|}~";
// define passward length
function handleSlider(){
    inputSlider.value = passwardLength;
    lengthDisplay.innerText = passwardLength;
    // slider ke color ko manage krne ke lia
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwardLength - min)*100/(max - min)) + "% 100%";
}
setIndicator("#ccc");
handleSlider();
function setIndicator(color){
    indicator.style.backgroundColor = color;
    // shadow 
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
function getRandInteger(min , max){
    return Math.floor(Math.random()*(max - min )) + min;
}
function GenerateRandomNumber(){
    return getRandInteger(1 , 9);
}
function generateLowerCase(){
    return String.fromCharCode(getRandInteger(97 , 123));
}
function generateUpperCase(){
    return String.fromCharCode(getRandInteger(65 , 91));
}
function generateSymbol(){
    let idx = getRandInteger(0 , symbols.length);
    return symbols.charAt(idx);
}
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;
    if(hasUpper && hasLower && (hasSym || hasNum) && passwardLength >= 8){
        setIndicator("#0f0");
    } else if( (hasLower || hasUpper ) &&(hasNum && hasSym ) &&passwardLength >= 6){
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }            
}
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwardDisplay.value);
        copyMsg.innerText = "copied";

    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
}
// to make copied text visible 
copyMsg.classList.add("active");
setTimeout( () => {
    copyMsg.classList.remove("active");
    // for passward shufelling
} , 2000);
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--){
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

inputSlider.addEventListener('input' , (e) => {
    passwardLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click' , () => {
    if(passwardDisplay.value){
        copyContent();
    }
})
function HandleCheckBoxChange(){
    checkCount = 0; 
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });
    // special condition
    if(passwardLength < checkCount ){
        passwardLength = checkCount;
        handleSlider();
    };
}
// for any change in checkbox
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change' , HandleCheckBoxChange);
    console.log("event listner is applied");
})
// check if the any check box is selected or not
generateBtn.addEventListener('click' , () => {
    console.log("add event listner done")
    if(checkCount == 0) {
        console.log("check count 0")
        return;
    }
    if(passwardLength < checkCount){
        passwardLength = checkCount;
        handleSlider();
    }
    console.log(" starting the journey");
    // journey to find the new passward
    // removing old passward
    passward = "";
    let funcArr = [];
    if(numbersCheck.checked){
        funcArr.push(GenerateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    
    // compulsary enteries
    for(let i = 0 ; i < funcArr.length ; i++){
        passward += funcArr[i]();
    }
    console.log("add compulsory entries done" );
   
    // remaining addition
    for(let i =  0 ; i < passwardLength - funcArr.length ; i++){
        let randomidx = getRandInteger(0 , funcArr.length);
        passward += funcArr[randomidx]();
    }
    console.log("add remaining entries done");
    //shuffle the password
    passward = shufflePassword(Array.from(passward));
    //show in UI
    passwardDisplay.value = passward;
    //calculate strength
    calcStrength();
});
