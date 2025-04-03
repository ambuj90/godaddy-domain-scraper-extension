function downloadCSV(domains) {
    let csvContent = "data:text/csv;charset=utf-8,Domain Name\n";

    domains.forEach((domain) => {
        csvContent += `${domain}\n`;
    });

    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "domain_list.csv");
    document.body.appendChild(link);
    link.click();
}