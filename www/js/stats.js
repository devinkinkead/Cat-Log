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
    
    // Can do the html shit here
    // console.log('test:'+ bam)
    // console.log(bam.length)
    offset = new Date().getTimezoneOffset()
    // console.log(offset)
    
    var petName = bam[0]['Pet_Name']
    for (let i=0; i<bam.length;i++) {
        t = new Date(bam[i]['Date'])
        // console.log('Old Date: ' + t)
        // // Milleseconds conversion
        // t = t.getTime() - (offset * 60  * 1000)
        // t =  new Date(t)
        // console.log("New Date: " + t)
    
        bam[i]['Date'] = t
    } 
    
    var fedCount = 0, dailyAmount = 0, weekVomit=0, lastFeeding="", lastVomit=""
    for (let i=0; i<bam.length; i++) {
        let date = new Date(bam[i]['Date'])
        let currentDate = new Date()
        if (date.getDate() == currentDate.getDate()  ) {
            if (bam[i]['Amount'] > 0) {
                fedCount += 1
                dailyAmount += bam[i]['Amount']
            }

            if (bam[i]['Amount'] > 0 ) {
                lastFeeding = new Date(bam[i]['Date'])

            }
            if (bam[i]['Vomit'] == 1) {
                lastVomit= new Date(bam[i]['Date'])
            }
            
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
    var feedingMsg = document.createElement('p')
    feedingMsg.innerHTML = "<ul> <li>" + petName + " has been fed " + fedCount + " times today. </li>" + "<li>" + petName + " has been fed " + dailyAmount + " Cups of food today." +  "</li><li>" + petName + " has puked " + weekVomit + " times this week" + 
    "</li> <li>" + "Last Feeding recorded on " + lastFeeding.toLocaleDateString() + " " + lastFeeding.toLocaleTimeString() + "</li>" + 
    "<li>" + "Last Vomit recorded on " + lastVomit.toLocaleDateString() + " " + lastVomit.toLocaleTimeString() + "</li>" +"</ul>"  
    
    
    feedingDiv.appendChild(feedingMsg)


    var notesHeading = document.createElement('h4')
    notesHeading.innerHTML = "This week's Notes: "
    feedingDiv.append(notesHeading)
    
    var notesMsg = document.createElement('p')
    
    notesMsg.innerHTML = "<ul>"
    for (let i=0; i<bam.length;i++) {
        let date = new Date(bam[i]['Date'])
        let currentDate = new Date()
        let weekBefore = currentDate.getTime() - (7 * 24 * 60 * 60 * 1000)

        let note = bam[i]['Notes']
        if (date.getTime() >= weekBefore && note != "") {
            date = date.toLocaleDateString() + " "+ date.toLocaleTimeString()
            notesMsg.innerHTML += "<li>" + date + ": " + note + "</li>"   
        }
        
    }



    notesMsg.innerHTML += "</ul>"
    feedingDiv.appendChild(notesMsg)

}


request()



