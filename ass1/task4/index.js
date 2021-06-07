//written by XiaoHu z5223731
function selectAll() {
    var buttonName = document.getElementById("all")
    if (buttonName.innerText == "Select All") {
        var checkboxes = document.getElementsByName("feature")
        for (var checkbox of checkboxes) {
            checkbox.checked = true
        }
        buttonName.innerText = "Deselect all"
    } else {
        var checkboxes = document.getElementsByName("feature")
        for (var checkbox of checkboxes) {
            checkbox.checked = false
        }
        buttonName.innerText = "Select All"
    }
}

function check(name) {
    const letters = /^[A-Za-z]+$/
    var input = document.getElementById(name).value
    var string = name.replace(/-/, " ")
    if (!input.match(letters) || input.length > 50 || input.length < 3) {
        document.getElementById(name).name = "invalid"
    } else {
        document.getElementById(name).name = "valid"
    }
}

function check_num() {
    const pattern = /^[0-9]{4}$/
    var postcode = document.getElementById("postcode").value
    if (!postcode.match(pattern)) {
        document.getElementById("postcode").name = "invalid"
    } else {
        document.getElementById("postcode").name = "valid"
    }
}

function check_DOB() {
    //DD/MM/YYYY
    const format = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/
    var dob = document.getElementById("DOB").value
    var list = dob.split('/')
    dob = list[1] + '/' + list[0] + '/' + list[2]
    if (!dob.match(format)) {
        document.getElementById("DOB").name = "invalid"
    } else {
        var date = Date.parse(dob)
        if (!isNaN(date)) {
            document.getElementById("DOB").name = "valid"
        } else {
            document.getElementById("DOB").name = "invalid"
        }
    }
}

function calculate_age(dob) {
    var date = new Date(dob)
    var diff = Date.now() - date.getTime()
    diff = new Date(diff)
    var year = diff.getUTCFullYear()
    var age = Math.abs(year - 1970)
    return age
}

function print() {
    check("street-name")
    check("suburb-name")
    check_num()
    check_DOB()
    var checkboxes = document.getElementsByName("feature")
    var buttonName = document.getElementById("all")
    var counter = 0
    for (var checkbox of checkboxes) {
        if (checkbox.checked == true) {
            counter++
        }
    }
    if (counter == 4){
        buttonName.innerText = "Deselect All"
    } else {
        buttonName.innerText = "Select All"
    }
    if (document.getElementById("street-name").name != "valid") {
        document.getElementById("output-text").innerHTML = "Please input a valid street name"
    } else if (document.getElementById("suburb-name").name != "valid") {
        document.getElementById("output-text").innerHTML = "Please input a valid suburb name"
    } else if (document.getElementById("postcode").name != "valid") {
        document.getElementById("output-text").innerHTML = "Please input a valid postcode"
    } else if (document.getElementById("DOB").name != "valid") {
        document.getElementById("output-text").innerHTML = "Please input a valid date of birth"
    } else {
        var age = calculate_age(document.getElementById("DOB").value)
        var street = document.getElementById("street-name").value
        var suburb = document.getElementById("suburb-name").value
        var postcode = document.getElementById("postcode").value
        var builds = document.getElementById("building-name")
        var selected = builds.options[builds.selectedIndex].innerText
        buttonName = document.getElementById("all")
        var article = 'a'
        if (selected == "Apartment") {
            article = "an"
        }
        var features = []
        checkboxes = document.getElementsByName("feature")
        for (var checkbox of checkboxes) {
            if (checkbox.checked == true) {
                features.push(checkbox.value)
            }
        }
        if (features.length == 0) {
            buttonName.innerText = "Select All"
            features = "no features"
        } else {
            if (features.length != 4) {
                buttonName.innerText = "Select All"
            } else {
                buttonName.innerText = "Deselect All"
            }
            features = features.join(", ")
            features = features.replace(/, ([^,]*)$/, ' and $1');
        }
        var string = "Your are " + age + " years old, and your address is " + street + " St, " + suburb + ", " + postcode + ", Australia. Your building is " + article + " " + selected + ", and it has " + features
        document.getElementById("output-text").innerHTML = string
    }
}

function reset() {
    document.getElementById("street-name").value = ""
    document.getElementById("suburb-name").value = ""
    document.getElementById("postcode").value = ""
    document.getElementById("DOB").value = ""
    document.getElementById("building-name").selectedIndex = 0
    document.getElementById("output-text").innerHTML = ""
    var buttonName = document.getElementById("all")
    var checkboxes = document.getElementsByName("feature")
    for (var checkbox of checkboxes) {
        checkbox.checked = false
    }
    buttonName.innerText = "Select All"
}