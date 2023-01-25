import { ICountry, IObjectElement, IReportElement, IReportHandle, IReportObjectResultData, IRow } from "./interfaces"

// Function to display data based on the selection done in the VA Object
const displayData = (data: IReportObjectResultData, target: string) => {
  // Generate table header based on columns information coming from VA
  const tableHeader = data.columns.map(column => `<th scope="col">${column.label.toUpperCase()}</th>`)
  // Generate table rows based on data coming from VA
  const tableRows = data.data.map((row: IRow) => {
    const cells: string[] = row.map((cell: string | number) => `<td>${cell}</td>`)
    return `<tr>${cells.join('')}</tr>`
  })
  // Build the HTML for the table
  let tableHTML = `<table class="table table-striped">`
  tableHTML += `<thead>`
  tableHTML += tableHeader.join('')
  tableHTML += `</thead>`
  tableHTML += `<tbody>`
  tableHTML += tableRows.join('')
  tableHTML += `</tbody>`
  tableHTML += `</table>`
  // Write the HTML table into the target div
  document.getElementById(target)!.innerHTML = tableHTML
}

// Add event listener to detect when the DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Populate the DropDown box for the country selection
  const selectBox = document.getElementById("country") as HTMLSelectElement
  const countries: ICountry[] = [{ label: "France", short: "FRA" }, { label: "Belgium", short: "BEL" }]
  for (let country of countries) {
    const option = document.createElement("option")
    option.value = country.short
    option.innerHTML = country.label
    selectBox.appendChild(option)
  }
})

// Add event listener to detect that the VA SDK is loaded
window.addEventListener("vaReportComponents.loaded", async () => {
  // Function to handle user selection for Countries and Year
  const handleFormSelection = async (event: Event, targetId: string) => {
    // Identify which field triggered the function
    const triggeredBy = event.target as HTMLElement
    // Retrieve the form element
    const form = document.querySelector("form")!
    // Retrieve the form element for Country
    const countryElement = form.elements.namedItem("country") as HTMLInputElement
    // Define the parameters to filter the VA object
    const parameters: Record<string, any> = {
      "Country": countryElement.value
    }
    // Retrieve the form element for Year
    const yearElement = form.elements.namedItem("year") as HTMLInputElement
    // Update the year value information when the Year range has been updated
    if (triggeredBy.id === "year") {
      document.getElementById("yearValue")!.innerHTML = yearElement.value
    }
    // Define the parameters to filter the VA object if the year is set
    if (document.getElementById("yearValue")!.innerHTML) {
      parameters["StartDate"] = new Date(parseInt(yearElement.value), 0, 1)
      parameters["EndDate"] = new Date(parseInt(yearElement.value), 11, 31)
    }
    // Retrieve the VA object
    const reportElement = document.getElementById(targetId) as IReportElement
    // Get the report handle for the VA object
    const reportHandle: IReportHandle = await reportElement.getReportHandle()
    // Pass parameters to the report object
    reportHandle.setReportParameters(parameters)
  }

  // Function to handle the selection change in the report object
  const handleSelectionChanged = () => {
    // Retrieve the new selected data
    const selectedData = objectHandle.getSelectedData()
    // Display the selected data
    if (selectedData[0]) {
      // Execute the function to generate the table
      displayData(selectedData[0], "info")
    } else {
      // Empty the info div if no data is selected in the report object
      document.getElementById("info")!.innerHTML = ""
    }
  }

  // Add EventListener to all elements in the form
  document.querySelector("form")!.addEventListener("change", (event: Event) => handleFormSelection(event, "VAGraph"))

  // Retrieve the report object element
  const reportObject = document.getElementById("VAGraph")! as IObjectElement
  // Get the report object handle for the VA object
  const objectHandle = await reportObject.getObjectHandle()
  // Add an event listener to detect selection changes
  objectHandle.addEventListener("selectionChanged", handleSelectionChanged)
})