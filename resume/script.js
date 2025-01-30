document.addEventListener("DOMContentLoaded", function () {
    function setText(selector, text) {
        document.querySelector(selector).innerHTML = text.replace(/\n/g, "<br>");
    }

    setText("#name", data.name);
    setText("#title", data.title);
    setText("#address", data.details.address);
    setText("#phone", data.details.phone);
    setText("#email", `<a href="mailto:${data.details.email}">${data.details.email}</a>`);
    
    let linksContainer = document.querySelector("#links");
    // document.querySelector("#linkedin").href = data.links.LinkedIn;
    Object.entries(data.links).forEach(([name, url]) => {
        linksContainer.innerHTML += `
            <div class="link">
                <a href="${url}" target="_blank">${name}</a>
            </div>`;
    });
    setText("#profile", data.profile);

    let skillsContainer = document.querySelector("#skills");
    skillsContainer.innerHTML = "";
    Object.entries(data.skills).forEach(([skill, level]) => {
        skillsContainer.innerHTML += `
            <div class="skill">
                <span>${skill}</span>
                <div class="skill-bar"><div style="width: ${level}%;"></div></div>
            </div>`;
    });

    let employmentContainer = document.querySelector("#employment");
    employmentContainer.innerHTML = "";
    data.employmentHistory.forEach((job, index) => {
        let tasks = job.tasks.map(task => `<li >${task}</li>`).join("");
        let jobClass = index === 2 ? "job page-break" : "job"; // Apply "page-break" to the third job
        employmentContainer.innerHTML += `
            <div class="${jobClass}">
                <h3>${job.position}</h3>
                <p class="company"><strong>${job.company}</strong></p>
                <p class="duration">${job.date}</p>
                <ul>${tasks}</ul>
            </div>`;
    });

    setText("#education", `<strong>${data.education.degree}</strong> <br> ${data.education.institution} <br> ${data.education.date}`);
});
