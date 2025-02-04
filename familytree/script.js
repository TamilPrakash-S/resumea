// script.js
const familyTree = document.getElementById("family-tree");

// Sample JSON data for the family tree
const persons = [
  {
    id: "1",
    name: "Person 1",
    gender: "male",
  },
  {
    id: "2",
    name: "Person 2",
    gender: "female",
  },
  {
    id: "3",
    name: "Person 3",
    gender: "female",
    mother: "Person 2",
    father: "Person 1",
  },
];

// Function to build the family tree structure
function buildFamilyTree(persons) {
  const tree = {};

  // Create a map of persons by name for easy lookup
  const personMap = {};
  persons.forEach((person) => {
    personMap[person.name] = { ...person, children: [] };
  });

  // Build the tree structure
  persons.forEach((person) => {
    if (person.mother || person.father) {
      const mother = personMap[person.mother];
      const father = personMap[person.father];

      if (mother) {
        mother.children.push(personMap[person.name]);
      }
      if (father) {
        father.children.push(personMap[person.name]);
      }
    } else {
      // This person is a root node (no parents)
      tree[person.name] = personMap[person.name];
    }
  });

  return tree;
}

// Function to create the family tree HTML
function createFamilyTree(person, parentElement) {
  const personDiv = document.createElement("div");
  personDiv.className = "person";
  personDiv.textContent = `${person.name} (${person.gender})`;

  if (person.children.length > 0) {
    personDiv.addEventListener("click", () => {
      const childrenDiv = personDiv.nextElementSibling;
      childrenDiv.classList.toggle("hidden");
    });
  }

  parentElement.appendChild(personDiv);

  if (person.children.length > 0) {
    const childrenDiv = document.createElement("div");
    childrenDiv.className = "children hidden";

    person.children.forEach((child) => {
      createFamilyTree(child, childrenDiv);
    });

    parentElement.appendChild(childrenDiv);
  }
}

// Build the family tree structure
const tree = buildFamilyTree(persons);

// Render the family tree
for (const rootName in tree) {
  createFamilyTree(tree[rootName], familyTree);
}