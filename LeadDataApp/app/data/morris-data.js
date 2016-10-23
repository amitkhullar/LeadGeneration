$(function() {

    

    Morris.Donut({
        element: 'morris-donut-chart',
        data: [{
            label: "LinkedIn",
            value: 12
        }, {
            label: "Naukri",
            value: 30
        }, {
            label: "Employees",
            value: 20
        },
        {
            label: "Directory",
            value: 10
        },
        {
            label: "Others",
            value: 10
        }],
        resize: true
    });

    Morris.Bar({
        element: 'morris-bar-chart',
        data: [{
            y: 'Jan',
            a: 100

        }, {
            y: 'Feb',
            a: 75

        }, {
            y: 'Mar',
            a: 50

        }, {
            y: 'Apr',
            a: 75

        }, {
            y: 'May',
            a: 50

        }, {
            y: 'June',
            a: 75

        }, {
            y: 'July',
            a: 100

        },
        {
            y: 'Aug',
            a: 90

        },
        {
            y: 'Sep',
            a: 90

        },
        {
            y: 'Oct',
            a: 80

        }

      ],
        xkey: 'y',
        ykeys: ['a', 'b'],
        labels: ['Lead Count', ''],
        hideHover: 'auto',
        resize: true
    });

});
