var POST_URL = "WEBHOOK URL";

function onSubmit(e) {
    var form = FormApp.getActiveForm();
    var allResponses = form.getResponses();
    var latestResponse = allResponses[allResponses.length - 1];
    var response = latestResponse.getItemResponses();
    var items = [];

    for (var i = 0; i < response.length; i++) {
        var question = response[i].getItem().getTitle();
        var answer = response[i].getResponse().toString();
        try {
            var parts = answer.match(/[\s\S]{1,1024}/g) || [];
        } catch (e) {
            var parts = answer;
        }

        if (answer == "") {
            continue;
        }
        for (var j = 0; j < parts.length; j++) {
            if (j == 0) {
                // my mod to better present a specific question's response in the webhook
                if (question.startsWith("What divisions and positions are you interested in?")) {
                  // separate the 3 multiple choice responses and label them in a new string
                  var driverSelections = parts[j].split(',');
                  var formattedSelections = 'Dev: ' + driverSelections[0] + '\n' + 'Inter: ' + driverSelections[1] + '\n' + 'Pro: ' + driverSelections[2];
                  items.push({
                    "name": question,
                    "value": formattedSelections,
                    "inline": false
                  });
                } else {
                  items.push({
                    "name": question,
                    "value": parts[j],
                    "inline": false
                  });
                }
            } else {
                items.push({
                    "name": question.concat(" (cont.)"),
                    "value": parts[j],
                    "inline": false
                });
            }
        }
    }

    var options = {
        "method": "post",
        "headers": {
            "Content-Type": "application/json",
        },
        "payload": JSON.stringify({
            // "content": "", // commented to remove extra line
            "embeds": [{
                "title": "New LNR Driver Application",
              "color": 15990832, // This is optional, you can look for decimal colour codes at https://www.webtoolkitonline.com/hexadecimal-decimal-color-converter.html
                "fields": items,
                "footer": {
                    "text": "Any admin please respond to said person ASAP"
                }
            }]
        })
    };

    UrlFetchApp.fetch(POST_URL, options);
};
