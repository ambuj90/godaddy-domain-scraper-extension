// Inject full SEO <td> beside domain Name column
setTimeout(() => {
    const domainElements = document.querySelectorAll("td.domain-name [data-cy='domainName']");
    const domains = Array.from(domainElements).map(el => el.innerText.trim());

    if (domains.length === 0) return;

    chrome.runtime.sendMessage({ action: "getSEOReport" }, (seoReports) => {
        if (!seoReports || seoReports.error) {
            console.error("Failed to get SEO data:", seoReports?.error || "Unknown error");
            return;
        }

        domainElements.forEach((domainEl, index) => {
            const row = domainEl.closest("tr");
            const report = seoReports[index];
            if (!row || !report) return;

            const wayback = report.wayback_report || {};
            const backlinks = report.backlinks_report || {};
            function colorize(value) {
                if (value >= 70) return "green";
                if (value >= 40) return "orange";
                return "red";
            }
            const seoHTML = `
                <div style="font-size: 12px; line-height: 1.4; color: #444;">
                    <strong>DR:</strong><span style="color:${colorize(report.DR)}">${report.DR}</span> ${report.DR}, 
                    <strong>UR:</strong> ${report.UR}, 
                    <strong>AR:</strong> ${report.AR}, 
                    <strong>RD:</strong> ${report.RD}<br/>
                    <strong>Wayback:</strong> ${wayback.first_snapshot || '-'} → ${wayback.last_snapshot || '-'} (${wayback.total_snapshots || 0} snapshots)<br/>
                    <strong>Backlinks:</strong> ${backlinks.total_backlinks || 0} (DoFollow: ${backlinks.do_follow || 0}, NoFollow: ${backlinks.no_follow || 0})
                </div>
            `;

            // Avoid duplicate injection
            if (!row.querySelector(".seo-full-report")) {
                const td = document.createElement("td");
                td.className = "seo-full-report";
                td.colSpan = 1; // you can tweak this if needed
                td.style.verticalAlign = "top";
                td.style.paddingLeft = "0";
                td.style.paddingRight = "0";
                td.style.maxWidth = "15rem";
                td.style.padding = "8px";
                td.style.minWidth = "15rem";
                td.innerHTML = seoHTML;

                // Insert just after the name column
                row.insertBefore(td, row.children[3]); // Assuming column[0] = checkbox, [1] = name, [2] = after Name
            }
        });

        chrome.runtime.sendMessage({ action: "scrapedDomains", data: domains });
    });
}, 3000);
