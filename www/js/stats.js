
let getWeightData = async function() {
    const weightData = await fetch('/WeightHistory')
    let data = await weightData.json()
    data = JSON.parse(data)
    var pet = getCookie('Pet_ID')
    // console.log(pet)
    if (pet == "") {
        // console.log('No Pet selected')
    }
    
    else if (data.length == undefined || (data.length == 0) ) {
        window.alert('Weight Data could not be found for Pet. Please Try again later.')
        // clearCookie('Pet_ID')
    }

    else {
        for (let i=0; i<data.length;i++) {
            t = new Date(data[i]['Date'])
            data[i]['Date'] = t
        }
        // console.log(data)
        
        let weightStatsDiv = document.getElementById('weightStats')

        while (weightStatsDiv.lastElementChild) {
            weightStatsDiv.removeChild(weightStatsDiv.lastElementChild)
        }

        let title = document.createElement('h4')
        title.innerHTML = "Weight History (All Time):"
        weightStatsDiv.appendChild(title)

        let weightArea = document.createElement('textarea')
        weightArea.id = "weightArea"
        weightArea.disabled = true
        for (let i=0;i<data.length;i++) {
            let date = data[i]['Date'].toLocaleDateString() + " " + data[i]['Date'].toLocaleTimeString()
            weightArea.value += "\u2022 " + date + ": " + data[i]['Weight'] + " lb" + "\r\n" + "\r\n"
            
        }

        weightStatsDiv.appendChild(weightArea)
    }





}

let getPets = async () => {
    const petRequest = fetch('/petNames')
    .then (
        function(value) {
            var data = value.json()
            return data
        }
    )
    var petList = []
    var pets = {}
    pets = await petRequest
    pets = JSON.parse(pets)
    // console.log(pets)


    for (let i=0;i<pets.length;i++) {
        petList.push(pets[i])
    }
    
    

    // console.log(petList)
    
    petSelector = document.getElementById('petSelect')
    
    while (petSelector.lastElementChild) {
        petSelector.removeChild(petSelector.lastElementChild)
    }

    let option = document.createElement('option')
    option.value = ""
    option.innerHTML = ""
    option.id = "None"
    petSelector.appendChild(option)
    
 

    
 
    // petSelector.selected = document.getElementById(getCookie('PName'))

    
    // Insert pets here
    

    // console.log(petList)
    for (let i=0; i<petList.length;i++) {
        let option = document.createElement('option')
        option.value = petList[i]['ID']
        option.innerHTML = petList[i]['Pet']
        option.id = petList[i]['Pet']
        petSelector.appendChild(option)
    }

       // Trying to select option that = the cookie (selected pet)
       try {
        
        // getCookie('PName')
        children = petSelector.children
        // console.log(test[0])
        
        for (let i=0; i<children.length;i++) {
            child = children[i]
            // console.log(children[i])
            if (getCookie('Pet_ID') == child.value) {
                child.selected = true
            }
        }


        }
    catch (TypeError) {
        
        // console.log('Not found')
    }

}




let request = async () => {
    const test = fetch('/stats')
    .then (
        function(value) {
            data = value.json()
            return data  
        }
    
    )
   var bam = []
    bam = await test
    bam = JSON.parse(bam)
    let statsRange = document.getElementById('statsRange').value
    
    // console.log(bam)
    

    
    
    var pet = getCookie('Pet_ID')
    // console.log(pet)
    if (pet == "") {
        // console.log('No Pet selected')
    }
    
    else if (bam.length == undefined || (bam.length == 0) ) {
        window.alert('Feeding Data could not be found for Pet. Please Try again later.')
        // clearCookie('Pet_ID')
    }
    else {
        var petName = bam[0]['Pet_Name']
    for (let i=0; i<bam.length;i++) {
        t = new Date(bam[i]['Date'])
        bam[i]['Date'] = t
    } 

    

    // console.log(bam)
    var fedCount = 0, dailyAmount = 0, weekVomit=0, lastFeeding=null, lastVomit=null
    for (let i=0; i<bam.length; i++) {
        let date = new Date(bam[i]['Date'])
        let currentDate = new Date()
        if (date.getDate() == currentDate.getDate()  ) {
            if (bam[i]['Amount'] > 0) {
                fedCount += 1
                dailyAmount += bam[i]['Amount']
            }

            
            
        }
        if (bam[i]['Amount'] > 0 ) {
            lastFeeding = new Date(bam[i]['Date'])

        }
        if (bam[i]['Vomit'] == 1) {
            lastVomit= new Date(bam[i]['Date'])
        }
        let weekBefore = currentDate.getTime() - (statsRange * 24 * 60 * 60 * 1000)
        
        if (date.getTime() >= weekBefore) {
            if (bam[i]['Vomit'] == 1) {
                weekVomit += 1
            }
        }
    }
    // console.log(fedCount)



    // console.log(bam)
    // for (let i=0; i<bam.length;i++) {
    //     var select = document.getElementById('petName')
    //     var opt = document.createElement('option')
    //     opt.value = bam[i]['Pet']
    //     opt.innerHTML = bam[i]['Pet']
    //     select.appendChild(opt)
    // }
    var feedingDiv = document.getElementById('todayFeeding')

    // clear out any previous feedingDiv children
    while (feedingDiv.lastElementChild) {
        feedingDiv.removeChild(feedingDiv.lastElementChild)
    }


    let statTitle = document.createElement('h4')
    statTitle.innerHTML = "Today's Stats:"
    feedingDiv.appendChild(statTitle)
    var feedingMsg = document.createElement('ul')
    
    let lastVomitDate, lastFeedingDate
    if (lastFeeding == null) {
        lastFeedingDate = "N/A"
    }
    else {
        lastFeedingDate = lastFeeding.toLocaleDateString() + " " + lastFeeding.toLocaleTimeString()
    }
    if (lastVomit == null) {
        lastVomitDate = "N/A"
    }
    else {
        lastVomitDate = lastVomit.toLocaleDateString() + " " + lastVomit.toLocaleTimeString()
    }

    feedingMsg.innerHTML = "<li>" + petName + " has been fed " + fedCount + " times today. </li>" + "<li>" + petName + " has been fed " + dailyAmount + " Cups of food today." +  "</li><li>" + petName + " has puked " + weekVomit + " times in the past " + statsRange + ' days' + 
    "</li> <li>" + "Last Feeding recorded on: " + lastFeedingDate + "</li>" + 
    "<li>" + "Last Vomit recorded on: " + lastVomitDate + "</li>"   
    
    
    feedingDiv.appendChild(feedingMsg)

    var notesHeading = document.createElement('h4')
    notesHeading.innerHTML = "Notes from previous " + statsRange + " days:"
    feedingDiv.append(notesHeading)
    
    var textA = document.createElement('textarea')
    textA.id = "notesArea"
    textA.disabled = true
    
    
    for (let i=0; i<bam.length;i++) {
        let date = new Date(bam[i]['Date'])
        let currentDate = new Date()
        let weekBefore = currentDate.getTime() - (statsRange * 24 * 60 * 60 * 1000)

        let note = bam[i]['Notes']
        if (i == 0) {
            
        }
        if (date.getTime() >= weekBefore && note != "") {
            date = date.toLocaleDateString() + " "+ date.toLocaleTimeString()
            textA.value +=  "\u2022 " + date + ": " + note + "\r\n" + "\r\n"
        }
        if (i == bam.length-1) {
        }
    }

    // console.log(notesMsg.innerHTML)
    
    feedingDiv.appendChild(textA)
    }
    
   
    
    

}

async function loginCheck() {
    let test = await fetch('/loginCheck')
    let result = await test.json()
    
    let resultParse = JSON.parse(JSON.stringify(result))
    
    if (resultParse.valid == 0) {
        window.alert('Session Expired. Logging out.')
        window.location = '/' 
    }
    else {
    }
}


function bodyFunction() {
loginCheck()
request()
getPets()
getWeightData()

}


