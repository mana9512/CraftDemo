export var FieldService = {
    getField: function (id) {
        return {
            "label": "Sales region",
            "required": false,
            "choices": [
                "Asia",
                "Australia",
                "Western Europe",
                "North America",
                "Eastern Europe",
                "Latin America",
                "Middle East and Africa"
            ],
            "order": "alphabetical",
            "defaultChoice": "North America",
            "newChoice": "",
            "type": "multi-select",
        }
    },
    saveField: function (fieldJson) {
        // Add the code here to call the API (or temporarily, just log fieldJson to the console)
        fetch('http://www.mocky.io/v2/566061f21200008e3aabd919', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fieldJson)
        })
            .then(response => response.json())
            .then(response => console.log(JSON.stringify(response)))
    }
}