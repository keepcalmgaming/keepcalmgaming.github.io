requirejs.config({
    baseUrl: 'lib',
    paths: {
        'app': '../app'
    }
});

requirejs(['app'], function(GMTK2020) {
    console.log('Starting application...');

    var app = new GMTK2020.App();
    app.start();
});
