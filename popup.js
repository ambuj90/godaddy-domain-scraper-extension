document.addEventListener("DOMContentLoaded", function () {
    const domainList = document.getElementById("domainList");
    const downloadButton = document.getElementById("downloadButton");

    document.getElementById("scrapeButton").addEventListener("click", function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ["content.js"]
            });
        });
    });

    chrome.runtime.onMessage.addListener((message) => {
        if (message.action === "scrapedDomains") {
            const domains = message.data;
            domainList.innerHTML = "";
            downloadButton.style.display = "block";
            downloadButton.onclick = () => downloadCSV(domains);

            // Fetch SEO Report from your local API
            fetch("http://localhost:3000/api/v1/sample")
                .then((res) => res.json())
                .then((seoReports) => {
                    domains.forEach((domain, index) => {
                        const li = document.createElement("li");
                        li.innerHTML = `<strong>${domain}</strong><br/>Loading SEO...`;
                        domainList.appendChild(li);

                        // Simulate one-to-one mapping
                        const report = seoReports[index];
                        if (report) {
                            li.innerHTML = `
                                <strong>${domain}</strong><br/>
                                DR: ${report.DR}, UR: ${report.UR}, AR: ${report.AR}, RD: ${report.RD}<br/>
                                Wayback: ${report.wayback_report.first_snapshot} → ${report.wayback_report.last_snapshot} (${report.wayback_report.total_snapshots} snapshots)<br/>
                                Backlinks: ${report.backlinks_report.total_backlinks} (DoFollow: ${report.backlinks_report.do_follow}, NoFollow: ${report.backlinks_report.no_follow})
                                <hr/>
                            `;
                        } else {
                            li.innerHTML = `<strong>${domain}</strong><br/>No SEO report found.<hr/>`;
                        }
                    });
                })
                .catch((err) => {
                    console.error("Error fetching SEO reports:", err);
                    domains.forEach((domain) => {
                        const li = document.createElement("li");
                        li.innerHTML = `<strong>${domain}</strong><br/>⚠️ Error fetching SEO data.<hr/>`;
                        domainList.appendChild(li);
                    });
                });
        }
    });
});
