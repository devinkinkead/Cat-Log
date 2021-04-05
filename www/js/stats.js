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
    
    var petName = bam[0]['Pet_Name']
    for (let i=0; i<bam.length;i++) {
        t = new Date(bam[i]['Date'])
        t.setMinutes(t.getMinutes() - offset)
        t =  t.toLocaleString()
    
        bam[i]['Date'] = t
    } 
    
    var fedCount = 0, dailyAmount = 0, weekVomit=0
    for (let i=0; i<bam.length; i++) {
        var date = new Date(bam[i]['Date']).getDate()
        var currentDate = new Date().getDate()
        if (date == currentDate  ) {
            if (bam[i]['Amount'] > 0) {
                fedCount += 1
                dailyAmount += bam[i]['Amount']
            }
            
        }
        if (date >= currentDate-7) {
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
    feedingMsg.innerHTML = "<ul> <li>" + petName + " has been fed " + fedCount + " times today." + "<li>" + petName + " has been fed " + dailyAmount + " Cups of food today." +  "<li>" + petName + " has puked " + weekVomit + " times this week" + 
    ""  
    feedingDiv.appendChild(feedingMsg)
    
   


}


request()
