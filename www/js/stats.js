
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
        petList.push(pets[i]['Pet'])
    }
    
    

    // console.log(petList)

    petSelector = document.getElementById('petSelect')
    
    let option = document.createElement('option')
    option.value = ""
    option.innerHTML = ""
    option.id = "None"
    petSelector.appendChild(option)
    
 

    
 
    // petSelector.selected = document.getElementById(getCookie('PName'))

    
    // Insert pets here
    


    for (let i=0; i<petList.length;i++) {
        let option = document.createElement('option')
        option.value = petList[i]
        option.innerHTML = petList[i]
        option.id = petList[i]
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
            if (getCookie('PName') == child.id) {
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

   var  bam = []
    bam = await test
    bam = JSON.parse(bam)
    // console.log(bam)
    var pet = ""
    var pet = getCookie('PName')
    // console.log(pet)
    if (pet == "") {
        // console.log('No Pet selected')
    }
    
    else if (bam.length == undefined || (bam.length == 0) ) {
        window.alert('Data could not be found for: ' + pet + '. Please Try again later.')
        clearCookie('PName')
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
        let weekBefore = currentDate.getTime() - (7 * 24 * 60 * 60 * 1000)
        
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
    let statTitle = document.createElement('h4')
    statTitle.innerHTML = "Today's Stats"
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

    feedingMsg.innerHTML = "<li>" + petName + " has been fed " + fedCount + " times today. </li>" + "<li>" + petName + " has been fed " + dailyAmount + " Cups of food today." +  "</li><li>" + petName + " has puked " + weekVomit + " times this week" + 
    "</li> <li>" + "Last Feeding recorded on: " + lastFeedingDate + "</li>" + 
    "<li>" + "Last Vomit recorded on: " + lastVomitDate + "</li>"   
    
    
    feedingDiv.appendChild(feedingMsg)


    var notesHeading = document.createElement('h4')
    notesHeading.innerHTML = "This week's Notes: "
    feedingDiv.append(notesHeading)
    
    var notesMsg = document.createElement('ul')
    
    notesMsg.innerHTML = ""
    
    for (let i=0; i<bam.length;i++) {
        let date = new Date(bam[i]['Date'])
        let currentDate = new Date()
        let weekBefore = currentDate.getTime() - (7 * 24 * 60 * 60 * 1000)

        let note = bam[i]['Notes']
        if (i == 0) {
            
        }
        if (date.getTime() >= weekBefore && note != "") {
            date = date.toLocaleDateString() + " "+ date.toLocaleTimeString()
            notesMsg.innerHTML += "<li>" + date + ": " + note + "</li>"   
        }
        if (i == bam.length-1) {
        }
    }

    // console.log(notesMsg.innerHTML)
    feedingDiv.appendChild(notesMsg)
    }
    
   
    
    

}


request()
getPets()


