import React, { useState, useEffect } from 'react'
import './Dashboard.css'
import Helper from '../helper'
import { DataGrid } from '@mui/x-data-grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Grid from '@mui/material/Grid'
import { Typography } from '@mui/material'

const convertTime = (date) => {
  const newDate = new Date(date);
  const time = newDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  return time;
}

const TabOne = () => {
  const [students, setStudents] = useState({})
  const [studentRows, setStudentRows] = useState([])
  const [filteredStudentRows, setFilteredStudentRows] = useState([])
  const [selectStudent, setSelectStudent] = useState(null);
  const [courses, setCourses] = useState({})
  const [courseRows, setCourseRows] = useState([])
  const [filteredCourseRows, setFilteredCourseRows] = useState([])
  const [selectCourse, setSelectCourse] = useState(null);
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [open, setOpen] = React.useState(false)

  useEffect(() => {
    Helper.post(Helper.getAPIUrl('getStudents'), {}).then(response => {
      setStudents(response.data.recordsets[0])
    })
    Helper.post(Helper.getAPIUrl('getCourses'), {}).then(response => {
      setCourses(response.data.recordsets[0])
    })
  }, [])

  useEffect(() => {
    if (students.length > 0) {
      setStudentRows(prepStudentRows(students))
    }
    if (courses.length > 0) {
      setCourseRows(prepCourseRows(courses))
    }
  }, [students, courses])

  const prepStudentRows = student => {
    const data = []
    student.map(item =>
      data.push({
        id: item.s_id,
        first_name: item.first_name,
        last_name: item.last_name,
        gender: item.gender
      })
    )
    return data
  }

  const prepCourseRows = courses => {
    const data = [];
    courses.map(item =>
      data.push({
        id: item.c_id,
        course_name: item.title,
        credits: item.credits,
        department: item.d_id,
        sec: item.sec_id,
        sem: item.semester,
        year: item.year,
        start: convertTime(item.start_time),
        end: convertTime(item.end_time)
      })
    )
    return data
  }

  const filterTable = () => {
    Helper.post(Helper.getAPIUrl('filterFirstLast'), {
      firstName,
      lastName
    }).then(response => {
      setFilteredStudentRows(prepStudentRows(response.data.recordsets[0]))
      if (response.data.recordsets[0].length === 0) {
        setOpen(true)
      }
    })
  }

  const handleStudentClick = (row) => {
    setSelectStudent(row);
  };

  const handleCourseClick = (row) => {
    setSelectCourse(row);
  };

  function handleEnroll() {
    
    if (!selectStudent || !selectCourse) {
      console.error("Invalid Input(s) - Select a student AND a course")
    } 
	else {
    	console.log(selectStudent.row);
		console.log(selectCourse.row);

    	let studetID = selectStudent.row.id;
    	let courseID = selectCourse.row.id; 

    	Helper.post(Helper.getAPIUrl('enroll'), { studetID, courseID }).then(response => {
    		if (!response || !response.data || !response.data.success) {
        		console.error("Enrolment Failed. Return an error message here later...");
				return;
        	}
			
			console.log("Enrolment Successful. Return an success message here later...");
			return;
      });
    }


  };

  const studentColumns = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'first_name', headerName: 'First Name', width: 125 },
    { field: 'last_name', headerName: 'Last Name', width: 125 },
    { field: 'gender', headerName: 'Gender', width: 100, hide: true }
  ]

  const courseColumns = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'course_name', headerName: 'Course', width: 150 },
    { field: 'credits', headerName: 'Credits', width: 100, hide: true },
    { field: 'department', headerName: 'Department', width: 100, hide: true },
    { field: 'sec', headerName: 'Section', width: 70 },
    { field: 'sem', headerName: 'Semester', width: 70 },
    { field: 'year', headerName: 'Year', width: 70 },
    { field: 'start', headerName: 'Start Time', width: 100 },
    { field: 'end', headerName: 'End Time', width: 100 }
  ]

  return (
    <>
      <div style={{ height: 700, width: '100%' }}>
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', paddingBottom: '40px', flexDirection: 'column'}}>
			<Typography variant="h3">Enroll</Typography>
			<Typography variant="h5">Select a student and course</Typography>
		</div>
        <div style={{ padding: "5px" }}>
          <TextField
            id='outlined-basic'
            label='First Name'
            variant='outlined'
            onChange={e => setFirstName(e.target.value)}
			sx={{p:1, width:160 }}
          />
          <TextField
            id='outlined-basic'
            label='Last Name'
            variant='outlined'
            onChange={e => setLastName(e.target.value)}
			sx={{p:1, width:160}}
          />
          <Button variant='contained' onClick={filterTable} sx={{p:1, mt:2}}>
            Filter
          </Button>
        </div>
        <div style={{ display: 'flex', height: '80%' }}>
          <div style={{ width: '45%', height: '100%', padding: '10px' }}>
            {filteredStudentRows.length > 0 ? (
              <DataGrid
			  	rows={filteredStudentRows}
				columns={studentColumns}
				onRowClick={handleStudentClick}
			  />
            ) : (
              studentRows.length > 0 && (
                <DataGrid
					rows={studentRows}
					columns={studentColumns}
					onRowClick={handleStudentClick}
				/>
              )
            )}
          </div>
          <div style={{ width: '50%', height: '100%', flex: 1, padding: '10px' }}>
            {courseRows.length > 0 ? (
              <DataGrid
			  	rows={courseRows}
				columns={courseColumns}
				onRowClick={handleCourseClick}
			  />
            ) : (
              <div>Loading courses</div>
            )}
          </div>
        </div>

        {open ? (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 999
            }}
          >
            <Alert
              onClose={() => {
                setOpen(false)
              }}
              severity='error'
            >
              <AlertTitle>Error</AlertTitle>
              No names with the provided filters{' '}
              <strong>- change your search!</strong>
            </Alert>
          </div>
        ) : (
          <></>
        )}
		<Grid container justifyContent="flex-end" sx={{p:1}}>
			<Button
				variant='contained'
				onClick={() => handleEnroll()}
				sx={{p:1, mt:2}}
			>
            Enroll
          </Button>
		</Grid>
      </div>
    </>
  )
}

export default TabOne
