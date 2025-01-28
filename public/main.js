
document.addEventListener('DOMContentLoaded', () => {
    const projectsContainer = document.getElementById('projects-container');
    const url = "https://eip-tek3.epitest.eu/api/projects?scholar_year=2023&include_rejected=true";
    
    const calculateAverageByCity = (projects) => {
      const averageByCity = {};
  
      projects.forEach(project => {
          const cityCode = project.ownerCity.name;
          const starsCount = project.starsCount;
          const status = project.status;

          //waiting_update, draft, rejected, approved, pending
          if (!(cityCode in averageByCity)) {
              averageByCity[cityCode] = {
                  totalStars: 0,
                  count: 0,
                  approved: 0,
                  rejected: 0,
                  waiting_update: 0,
                  draft: 0,
                  pending: 0,
                  
              };
          }
  
          averageByCity[cityCode].totalStars += starsCount;
          averageByCity[cityCode].count++;
  
          switch (status) {
              case 'approved':
                  averageByCity[cityCode].approved++;
                  console.log(project.name, project.description)
                  break;
              case 'rejected':
                  averageByCity[cityCode].rejected++;
                  break;
              case 'waiting_update':
                  averageByCity[cityCode].waiting_update++;
                  break;
              case 'draft':
                  averageByCity[cityCode].draft++;
                  break;
              case 'pending':
                  averageByCity[cityCode].pending++;
                  break;
              default:
                  break;
          }
      });
  
      // Calculate averages
      for (const cityCode in averageByCity) {
          const city = averageByCity[cityCode];
          city.totalReview = city.approved + city.rejected + city.waiting_update
          city.avgReviewProject = (city.totalReview / city.count) * 100 || 0
          city.averageStars = city.totalStars / city.count;
          city.avgApproved = (city.approved / city.count) * 100 || 0;
          city.avgRejected = (city.rejected / city.count) * 100 || 0;
          city.avgPending = (city.pending / city.count) * 100 || 0;
          city.avgWaiting_update = (city.waiting_update / city.count) * 100 || 0;
          city.avgDraft = (city.draft / city.count) * 100 || 0;
      }
      return averageByCity;
  };

  const sortCitiesByAverageReview = (averageReview) => {
    const sortedCities = Object.keys(averageReview).sort((cityCodeA, cityCodeB) => {
        return averageReview[cityCodeB].totalReview - averageReview[cityCodeA].totalReview;
    });
    return sortedCities;
  };
    
  const displayAverageByCity = (sortedCities, averageByCity) => {
    const container = projectsContainer;
    container.innerHTML = ''; // Clear previous content
    
    sortedCities.forEach(cityCode => {
        const city = averageByCity[cityCode];
        const cityDiv = document.createElement('div');
        cityDiv.classList.add('city-container');
        cityDiv.innerHTML = `
          <h3>${cityCode}</h3>
          <div class="project-info">
              <p><strong>Count project:</strong> ${city.count}</p>
              <p><strong>Average Stars:</strong> ${city.averageStars.toFixed(2)}%</p>
              <hr>
              <p><strong>Total Review Project:</strong> ${city.totalReview}</p>
              <p><strong>Average Review Project:</strong> ${city.avgReviewProject.toFixed(2)}</p>
              <hr>
              <p><strong>Count approved:</strong> ${city.approved}</p>
              <p><strong>Average approved:</strong> ${city.avgApproved.toFixed(2)}%</p>
              <hr>
              <p><strong>Count rejected:</strong> ${city.rejected}</p>
              <p><strong>Average rejected:</strong> ${city.avgRejected.toFixed(2)}%</p>
              <hr>
              <p><strong>Count waiting update:</strong> ${city.waiting_update}</p>
              <p><strong>Average waiting update:</strong> ${city.avgWaiting_update.toFixed(2)}%</p>
              <hr>
              <p><strong>Count pending:</strong> ${city.pending}</p>
              <p><strong>Average pending:</strong> ${city.avgPending.toFixed(2)}%</p>
              <hr>
              <p><strong>Count draft:</strong> ${city.draft}</p>
              <p><strong>Average draft:</strong> ${city.avgDraft.toFixed(2)}%</p>
          </div>
      `;
        container.appendChild(cityDiv);
    });
  };
  
  const displayProjects = (sortedProjects) => {
      projectsContainer.innerHTML = '';
      let rank = 0;
      sortedProjects.forEach(project => {
          rank += 1;
          const projectDiv = document.createElement('div');
          projectDiv.classList.add('project');
            projectDiv.innerHTML = `
                <h2>Rank : ${rank}</h2>
                <h2>Project ID: ${project.id}</h2>
                <p><strong>Name:</strong> ${project.name}</p>
                <p><strong>Views Count:</strong> ${project.viewsCount}</p>
                <p><strong>Stars Count:</strong> ${project.starsCount}</p>
                <p><strong>City:</strong> ${project.ownerCity.name}</p>
                <p><strong>Owner:</strong> ${project.owner}</p>
                <p><strong>Recruit:</strong> ${project.lookingForMembers}</p>
                <p><strong>Status:</strong> ${project.status}</p>
                <p><strong>Track:</strong> ${project.envisagedType}</p>
                <p><strong>description:</strong> ${project.description}</p>
                <p><strong>Video:</strong> ${project.videoUploaded ? 'Yes' : 'No'}</p>
            `;            
          projectsContainer.appendChild(projectDiv);
      });
    };

    const fetchData = (token) => {
        const options = {
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "priority": "u=1, i",
                "authorization": `Bearer ${token}`,
                "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Linux\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "Referer": "https://eip-tek3.epitest.eu/projects",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            method: "GET"
        };

        fetch(url, options)
        .then(response => {
          if (response.ok) {
            document.getElementById('fetchProjectsButton').style.backgroundColor = 'green';
            return response.json();
          } else {
            document.getElementById('fetchProjectsButton').style.backgroundColor = 'red';
            throw new Error('La requête a échoué');
          }
        })
        .then(data => {
          let projects = data.results;
        
          document.getElementById('sortByStarsButton').addEventListener('click', () => {
            projects.sort((a, b) => {
                if (b.starsCount !== a.starsCount) {
                    return b.starsCount - a.starsCount;
                } else {
                    return b.viewsCount - a.viewsCount;
                }
            });
            displayProjects(projects, true);
          });

          document.getElementById('sortByViewsButton').addEventListener('click', () => {
              projects.sort((a, b) => b.viewsCount - a.viewsCount);
              displayProjects(projects);
          });
        
          document.getElementById('sortByAverageCityButton').addEventListener('click', () => {
            const averageByCity = calculateAverageByCity(projects);
            const sortedCities = sortCitiesByAverageReview(averageByCity);
            displayAverageByCity(sortedCities, averageByCity);
          });
          document.getElementById('sortByStatusButton').addEventListener('click', () => {
            projects.sort((a, b) => {
              if (b.status === 'approved' && a.status !== 'approved') {
                return 1;
              } else if (a.status === 'approved' && b.status !== 'approved') {
                return -1;
              } else {
                return 0; 
              }
            });
            displayProjects(projects);
        });
        })
        .catch(error => console.error('Error:', error));
    };

    document.getElementById('fetchProjectsButton').addEventListener('click', () => {
      const token = document.getElementById('tokenInput').value;
      localStorage.setItem('authToken', token);
      fetchData(token);
    });

    window.addEventListener('load', () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
          document.getElementById('tokenInput').value = storedToken;
          console.log('Loaded token from local storage:', storedToken);
      }
    });
});

