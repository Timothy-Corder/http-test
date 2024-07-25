var answers = ["MERGE", "JOIN", "LINK", "CONNECT"]
const BUTTON_NAMES = ["bt1","bt2","bt3","bt4"]

var correctCount = 0
var ansLen = answers.length
var randomAnswers = []
for(var _ = 0;_ < ansLen; _++)
{
    var chosenInd = Math.floor(Math.random() * answers.length)
    var chosen = answers[chosenInd]
    answers.splice(chosenInd, 1)
    randomAnswers.push(chosen)
}
function checkAnswer(btnId = (String))
{
    answer = document.getElementById(btnId).innerText
    if(answer === ("JOIN"))
    {
        document.getElementById(btnId).classList.add('correct');
        var isCorrect = true;
        correctCount++
    }
    else
    {
        document.getElementById(btnId).classList.add('incorrect');
        var isCorrect = false;
    }
    answered(isCorrect)
}
for (var i = 0; i < BUTTON_NAMES.length; i++)
{
    button = document.getElementById(BUTTON_NAMES[i])
    button.innerHTML = ("<strong>").concat(randomAnswers[i]).concat("</strong>")
}
function answered(isCorrect = (Boolean))
{
    if(isCorrect)
    {
        var showText = "Correct!"
    } else
    {
        var showText = "Incorrect!"
    }
    for (var i = 0; i < BUTTON_NAMES.length; i++)
    {
        button = document.getElementById(BUTTON_NAMES[i])
        button.setAttribute("onclick", "")
    }
    console.log(correctCount)
    resp = document.getElementById("response")
    resp.innerHTML = ("<strong>").concat(showText).concat("</strong>")
}
function respond()
{
    ele = document.getElementById("freeResp")
    correct = checkResponse()
    if(correct)
    {
        ele.classList.remove("incorrect")
        ele.classList.add("correct")
        showText = "Correct!"
    }
    else
    {
        ele.classList.remove("correct")
        ele.classList.add("incorrect")
        showText = "Incorrect!"
    }
    resp = document.getElementById("response")
    resp.innerHTML = ("<strong>").concat(showText).concat("</strong>")
    document.getElementById("submit").setAttribute("onclick", "")
}
function checkResponse()
{
    textField = document.getElementById("freeResp");
    text = textField.value.toLowerCase();
    if((text.includes("never") && !(text.includes("not"))) || (text.includes("not") && text.includes(" ever")))
    {
        return true;
    }
    return false;
}