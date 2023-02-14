const express = require('express');
const Router = express.Router;
const bodyParser = require('body-parser');
const json = bodyParser.json;
const urlencoded = bodyParser.urlencoded;
const cors = require('cors');

class API {
    
    constructor(database) {
        
        this.database = database;
        let API_PORT = process.env.PORT || 5000;
        let app = express();
        app.use(urlencoded({ extended: true }));
        app.use(json());

        let router = Router();

        this.handle(router);

        app.use(cors());
        app.use('/', router);

        /* this.database.authenticateStudent('Aaron', 'Alejo', status => {
            //response.json({ success: status });
            console.log(status);
        }); */

        /* dbOperations.getStudents().then(res => {
            console.log(res.recordset);
        }) */


        app.listen(API_PORT, () => console.log(`Listening port ${API_PORT}`));
    }

    /**
     * The primary handler for organizing GET and POST requests.
     * @param router The express router we are using.
     */
    async handle(router) {
        // Blank get response when someone attempts to connect to the API directly.
        router.get('/', this.handleRoot.bind(this));

        router.post('/login', this.handleLogin.bind(this));
        router.post('/enroll', this.handleEnrollStudent.bind(this));
        router.post('/getStudents', this.getStudents.bind(this));
        router.post('/filterFirstLast', this.filterFirstLast.bind(this));
        router.post('/getCourses', this.getCourses.bind(this));
        router.post('/filterCoursesByDept', this.filterCoursesByDept.bind(this));
        router.post('/getDepartments', this.getDepartments.bind(this));
    }

    /**
     * Handles the root response when making a GET request directly to the server.
     * @param request The request passed on.
     * @param response The response that we send back to the client/browser/etc.
     */
    handleRoot(request, response) {
        response.json({ response: 'lmao something happened here kek.' });
    }

    /**
     * Check if the credentials are correct and authenticate login.
     * @param request Request body contains the username and password.
     * @param response Response to the client indicating the success status.
     */
    handleLogin(request, response) {
        let body = request.body;
        
        // Check if the request body is valid/empty and if the email/password are valid.
        if (!body || !body.email || !body.password) return;
        
        this.database.authenticateStudent(body.email, body.password).then(res => {
            
            if(body.password !== res?.recordset[0].last_name || res?.recordset.length === 0) {
               //console.log(false);
               response.json({ success: false });
            } else{
               //console.log(true);
               response.json({ success: true });
            }
           
       });

    }
    
    /**
     * Enrolls student with s_id(student ID) into a course with c_id. 
     * @param request Request body contains the student ID and course ID.
     * @param response Response to the client indicating the success status.
     */
    handleEnrollStudent(request, response) {
        let body = request.body;
        
        // Check if the request body is validity.
        if (!body || !body.studentID || !body.courseID || !body.sectionID || !body.semester || !body.year || !body.start || !body.end || !body.takesID || !body.instructorID) return;   
        
        this.database.enrollStudent(body.studentID, body.courseID, body.sectionID, body.semester, body.year, body.start, body.end, body.takesID, body.instructorID).then(res => {
            
            if (!res){
                response.json({ success: false });
            } else {
                response.json({ success: true });
            }
        });
    }

    /**
     * 
     * @param response Response to the client indicating the success status.
     */
    getDepartments(request, response) {
        let body = request.body;
            
        this.database.getDepartments().then(res => {
            //console.log(res);
            response.json(res);
        });
    }

    /**
     * 
     * @param response Response to the client indicating the success status.
     */
     getCourses(request, response) {
        let body = request.body;
            
        this.database.getCourses().then(res => {
            //console.log(res);
            response.json(res);
        });
    }

    /**
     * API to get the filtered courses
     * @param request Request body contains the department id filters
     * @param response Response to the client with filtered courses
     */
    filterCoursesByDept(request, response) {
        let body = request.body;
        
        this.database.filterCoursesByDept(body.d_id).then(res => {
            console.log(res);
            console.log("did it work?\n");
            response.json(res);
        });
    }

    /**
     * 
     * @param response Response to the client indicating the success status.
     */
    getStudents(request, response) {
        let body = request.body;
            
        this.database.getStudents().then(res => {
            //console.log(res);
            response.json(res);
        });
    }

    /**
     * API to get the filtered stuff
     * @param request Request body contains the first and last name filters
     * @param response Response to the client with filtered students
     */
    filterFirstLast(request, response) {
        let body = request.body;
        
        this.database.filterStudentsFirstLast(body.firstName, body.lastName).then(res => {
            console.log(res);
            console.log("did it work?\n");
            response.json(res);
        });
    }
    
}
module.exports = API;