function provisionInfra() {
	var selectedScenario = document.getElementById("scenario").value;
	var tfModuleName = document.getElementById("tfModuleName").value;
	var tfRunID = document.getElementById("tfRunID").value;

	// Redirect to provisioninn page with the selected scenario as a query parameter
	window.location.href =
		"/provision_infra?scenario=" + encodeURIComponent(selectedScenario) +
		"&tf_run_id=" + encodeURIComponent(tfRunID) +
		"&tf_module_name=" + encodeURIComponent(tfModuleName);
}

function updateProgress() {
	var urlParams = new URLSearchParams(window.location.search);
	var tfRunID = urlParams.get("tf_run_id");

	fetch("/get_progress?tf_run_id=" + encodeURIComponent(tfRunID))
		.then(response => {
			if (response.ok) {
				return response.json();
			} else {
				// If response status is not okay, throw an error
				throw new Error(`Failed to fetch progress. Status: ${response.status}`);
			}
		})
		.then(data => {
			// Update the progress bar
			// console.log(data)
			document.getElementById("progress-bar").style.width = data.progress_percent + "%";
			document.getElementById("current-status").innerText = data.status;

			if (data.plan != "") {
				document.getElementById("terraform-plan").innerText = data.plan;
				document.getElementById("terraform-plan-container").style.display = "block";
			}

			if (data.status.includes("approval")) {
				document.getElementById("signal-container").style.display = "block";
			}

			if (data.progress_percent === 100) {
				// Redirect to order confirmation with the tf_run_id
				window.location.href = "/provisioned?tf_run_id=" + encodeURIComponent(tfRunID);
			} else {
				// Continue updating progress every second
				setTimeout(updateProgress, 1000);
			}
		})
		.catch(error => {
			// Log the detailed error message to the console
			console.error("Error fetching progress:", error.message);

			// Display the error message in the web browser
			document.getElementById("error-message").innerText = error.message;

			// Handle the error by showing a red status bar
			document.getElementById("progress-bar").style.backgroundColor = "red";
		});
}

// Define the signal function
function signal(decision) {
	// Get the order_id from the URL query parameters
	var urlParams = new URLSearchParams(window.location.search);
	var tfRunID = urlParams.get("tf_run_id");
	var reason = document.getElementById("reason").value;

	// Perform AJAX request to the server for signaling
	fetch("/signal?tf_run_id=" + encodeURIComponent(tfRunID), {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			decision: decision,
			reason: reason
		})
	})
		.then(response => {
			if (response.ok) {
				console.log("Signal sent successfully");
			} else {
				console.error("Failed to send signal");
			}
		})
		.catch(error => {
			console.error("Error during signal:", error.message);
		});
}

function reloadMainPage() {
	window.location.href = "/";
}
