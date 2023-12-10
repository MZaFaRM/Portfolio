export class Projects {
    constructor(content) {
    this.content = content;
    this.outputArea = `
                        <br>
                            <span style="color: white">
                                My projects:
                            </span>
                        <br>
                            --
                        <br>
                            <br>`;
  }
  async getProject(projectName) {
    const projects = await this.getProjects();
    if (projects.some(project => project.projectId === projectName)) {
      let project = this.content.querySelector(
        ".frames .project.hidden#" + projectName
      );
      project.classList.remove("hidden");
      this.outputArea = project.outerHTML;
      return this.outputArea
    }
    else {
        throw new Error(`Project not found ${projectName}`)
    }
  }

  async listProjects() {
    let projectsArray = await this.getProjects();
    return projectsArray.reduce((obj, project) => {
      obj[project.projectId] = project.description;
      return obj;
    }, {});
  }

  async getProjects() {
    try {
      const projectElements = this.content.querySelectorAll(".frames .project");

      let projectIds = Array.from(projectElements, (element) => element.id);
      let projectDesc = Array.from(projectElements, (element) =>
        element.querySelector(".description")
      );

      return projectIds.map((projectId, index) => {
        const descriptionElement = projectDesc[index];
        const description = descriptionElement
          ? descriptionElement.textContent.replace(
              /^[\n* *: *]+|[ *: *]+$/g,
              ""
            )
          : "";

        return { projectId, description };
      });
    } catch (error) {
      console.error("Error processing projects:", error);
      return [];
    }
  }
}
