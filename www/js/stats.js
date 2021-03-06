let getWeightData = async function() {
    var pet = getCookie('Pet_ID')
    if (pet != undefined && pet != "") {
        const weightData = await fetch('/WeightHistory')
        let data = await weightData.json()
        data = JSON.parse(data)
        // console.log(pet)
        
        
        if (data.hasOwnProperty('invalid')) {
            window.alert('Session Expired. Signing Out')
            signOut()
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
    

    if (pets.hasOwnProperty('invalid')) {
        window.alert('Session Expired. Signing Out')
        signOut()
    }

    for (let i=0;i<pets.length;i++) {
        petList.push(pets[i])
    }
    
        
    petSelector = document.getElementById('petSelect')
    
    while (petSelector.lastElementChild) {
        petSelector.removeChild(petSelector.lastElementChild)
    }

    let option = document.createElement('option')
    option.value = ""
    option.innerHTML = ""
    option.id = "None"
    petSelector.appendChild(option)
    
 
    
    // Insert pets here
    

    for (let i=0; i<petList.length;i++) {
        let option = document.createElement('option')
        option.value = petList[i]['ID']
        option.innerHTML = petList[i]['Pet']
        option.id = petList[i]['Pet']
        petSelector.appendChild(option)
    }

       // Trying to select option that = the cookie (selected pet)
       try {
        
        children = petSelector.children
        
        for (let i=0; i<children.length;i++) {
            child = children[i]
            if (getCookie('Pet_ID') == child.value) {
                child.selected = true
            }
        }


        }
    catch (TypeError) {
        
        // console.log('Not found')
    }

}




let getPetStats = async () => {

    var pet = getCookie('Pet_ID')
    if (pet != "") {
        const test = fetch('/petStats')
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
    

    
    if (data.hasOwnProperty('invalid')) {
        window.alert('Session Expired. Signing Out')
        signOut()
    }

    else if (bam.length == undefined || (bam.length == 0) ) {
        window.alert('Feeding Data could not be found for Pet. Please Try again later.')
    }
    else {
        var petName = bam[0]['Pet_Name']
    for (let i=0; i<bam.length;i++) {
        t = new Date(bam[i]['Date'])
        bam[i]['Date'] = t
    } 

    
    var fedCount = 0, dailyAmount = 0, weekVomit=0, lastFeeding=null, lastVomit=null
    for (let i=0; i<bam.length; i++) {
        let date = new Date(bam[i]['Date'])
        let currentDate = new Date()
        if (isSameDay(date, currentDate)) {
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
    
    let currentDate = new Date()
    for (let i=0; i<bam.length;i++) {
        let date = new Date(bam[i]['Date'])
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
    feedingDiv.appendChild(textA)
    }
    }
    
    
   
    
    

}



async function bodyFunction() {
await getPets()
await getPetStats()
await getWeightData()

}

function isSameDay(dataDate, currentDate) {
    if (dataDate.getDate() == currentDate.getDate() && dataDate.getMonth() == currentDate.getMonth() &&
    dataDate.getFullYear() == currentDate.getFullYear() ) {
        return true
    } 
    else {
        return false
    }
}


function signOut() {
    window.location = "/"
}



