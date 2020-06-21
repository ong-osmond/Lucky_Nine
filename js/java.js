//Loop over questions array and build html
for (i = 0; i < questions.length; i++) {
    var qhead = $("<h4>").append(questions[i].question);
    var form  = $("<form>");

    //No
    var lAbsent = $("<label>").html("Absent: ").attr("for", "absent");
    var cAbsent = $("<input>").attr("type", "radio").attr("id", "absent");

    //Yes
    var lPresent = $("<label>").html("Present: ").attr("for", "present");
    var cPresent = $("<input>").attr("type", "radio").attr("id", "present");

    
    $("#questionsList").append(qhead).append(form);
    $(form).append(lAbsent).append(cAbsent).append(lPresent).append(cPresent);
    
}