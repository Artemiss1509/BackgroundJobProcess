document.addEventListener('DOMContentLoaded', async () => {
    toggleFormFields();
    await fetchFailedJobs();
    const jobStatus = document.getElementById('statsform');
    const addJobForm = document.getElementById('job-form');
    const taskTypeSelect = document.getElementById('task-type');

    taskTypeSelect.addEventListener('change', toggleFormFields);

    jobStatus.addEventListener('submit', getJobById);
    addJobForm.addEventListener('submit', addNewJob);


    
});

async function fetchFailedJobs (){
    try {
        const response = await axios.get('http://localhost:3000/admin/failed-jobs');
        const failedJobs = response.data.failedJobs;

        const failedDiv = document.getElementById('failed-jobs');
        failedDiv.innerHTML = '';

        if (failedJobs.length === 0) {
            failedDiv.innerHTML = '<p>No failed jobs found.</p>';
            return;
        }

        const table = document.createElement('table');
        const headerRow = document.createElement('tr');
        ['ID', 'Status', 'Task Type', 'Payload', 'Created At', 'Completed At'].forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        failedJobs.forEach(job => {
            const row = document.createElement('tr');
            [job.id, job.status, job.task_type, JSON.stringify(job.payload), new Date(job.created_at).toLocaleString(),'N/A'].forEach(cellData => {
                const td = document.createElement('td');
                td.textContent = cellData;
                row.appendChild(td);
            });
            table.appendChild(row);
        });

        failedDiv.appendChild(table);
    } catch (error) {
        console.error('Error fetching failed jobs:', error);
        const failedDiv = document.getElementById('failed-jobs');
        failedDiv.innerHTML = '<p>Error loading failed jobs. Please try again later.</p>';
    }
};

async function getJobById(event) {
    event.preventDefault();
    try {
        const id = document.getElementById('job-id').value;
        const response = await axios.get(`http://localhost:3000/jobs/${id}`);
        const job = response.data;

        const resultDiv = document.getElementById('job-details');
        resultDiv.innerHTML = `
            <h3>Job Details</h3>
            <p><strong>ID:</strong> ${job.id}</p>
            <p><strong>Status:</strong> ${job.status}</p>
            <p><strong>Task Type:</strong> ${job.task_type}</p>
            <p><strong>Payload:</strong> ${JSON.stringify(job.payload)}</p>
            <p><strong>Created At:</strong> ${new Date(job.created_at).toLocaleString()}</p>
            <p><strong>Completed At:</strong> ${job.completed_at ? new Date(job.completed_at).toLocaleString() : 'N/A'}</p>
        `;
        
    } catch (error) {
        console.error('Error fetching job details:', error);
        const resultDiv = document.getElementById('job-details');
        resultDiv.innerHTML = '<p>Error loading job details. Please check the job ID and try again.</p>';
    }
}

async function addNewJob(event) {
    event.preventDefault();
    try {
        const taskType = document.getElementById('task-type').value;
        let payload;
        switch (taskType) {
            case 'send_email':
                payload = {
                    to: document.getElementById('email').value,
                    subject: document.getElementById('subject').value
                };
                break;
            case 'generate_report':
                payload = {
                    reportType: document.getElementById('report-type').value
                };
                break;
            case 'resize_image':
                payload = {
                    imageUrl: document.getElementById('image-url').value,
                    size: document.getElementById('dimensions').value
                };
                break;
            default:
                alert('Unsupported task type');
                return;
        }
        const response = await axios.post('http://localhost:3000/jobs', {
            task_type: taskType,
            payload,
            priority: 1
        });
        alert(`Job added with ID: ${response.data.jobId}`);
    } catch (error) {
        console.error('Error adding new job:', error);
        alert('Error adding job. Please check the input and try again.');
    }
}

function toggleFormFields() {
    const taskType = document.getElementById('task-type').value;
    document.getElementById('emailField').style.display = taskType === 'send_email' ? 'block' : 'none';
    document.getElementById('reportField').style.display = taskType === 'generate_report' ? 'block' : 'none';
    document.getElementById('imageField').style.display = taskType === 'resize_image' ? 'block' : 'none';
}