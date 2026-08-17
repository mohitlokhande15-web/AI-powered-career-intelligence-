"""
Skill Gap / Course Recommendations
-----------------------------------
Static, curated skill -> course mapping. Fast, dependency-free, and
matches SKILL_KEYWORDS in resume_parser so lookups always hit.
"""
from typing import Dict, List
from typing import Dict, List
from app.ai_modules.resume_parser import SKILL_KEYWORDS

COURSE_CATALOG: Dict[str, List[Dict[str, str]]] = {
    "python": [{"title": "Python for Everybody", "provider": "Coursera", "url": "https://www.coursera.org/specializations/python"}],
    "java": [{"title": "Java Programming Masterclass", "provider": "Udemy", "url": "https://www.udemy.com/course/java-the-complete-java-developer-course/"}],
    "javascript": [{"title": "The Complete JavaScript Course", "provider": "Udemy", "url": "https://www.udemy.com/course/the-complete-javascript-course/"}],
    "typescript": [{"title": "Understanding TypeScript", "provider": "Udemy", "url": "https://www.udemy.com/course/understanding-typescript/"}],
    "react": [{"title": "React - The Complete Guide", "provider": "Udemy", "url": "https://www.udemy.com/course/react-the-complete-guide-incl-redux/"}],
    "next.js": [{"title": "Next.js & React - The Complete Guide", "provider": "Udemy", "url": "https://www.udemy.com/course/nextjs-react-the-complete-guide/"}],
    "node.js": [{"title": "The Complete Node.js Developer Course", "provider": "Udemy", "url": "https://www.udemy.com/course/the-complete-nodejs-developer-course-2/"}],
    "fastapi": [{"title": "FastAPI - The Complete Course", "provider": "Udemy", "url": "https://www.udemy.com/course/fastapi-the-complete-course/"}],
    "django": [{"title": "Django for Everybody", "provider": "Coursera", "url": "https://www.coursera.org/specializations/django"}],
    "flask": [{"title": "Flask Bootcamp", "provider": "Udemy", "url": "https://www.udemy.com/course/python-and-flask-bootcamp-create-websites-using-flask/"}],
    "sql": [{"title": "SQL for Data Science", "provider": "Coursera", "url": "https://www.coursera.org/learn/sql-for-data-science"}],
    "postgresql": [{"title": "The Complete SQL Bootcamp", "provider": "Udemy", "url": "https://www.udemy.com/course/the-complete-sql-bootcamp/"}],
    "mysql": [{"title": "MySQL Database for Beginners", "provider": "Udemy", "url": "https://www.udemy.com/course/mysql-database-for-beginners/"}],
    "mongodb": [{"title": "MongoDB - The Complete Developer's Guide", "provider": "Udemy", "url": "https://www.udemy.com/course/mongodb-the-complete-developers-guide/"}],
    "aws": [{"title": "AWS Certified Cloud Practitioner", "provider": "Coursera", "url": "https://www.coursera.org/professional-certificates/aws-cloud-technology-consultant"}],
    "azure": [{"title": "Microsoft Azure Fundamentals", "provider": "Coursera", "url": "https://www.coursera.org/learn/microsoft-azure-fundamentals-az-900"}],
    "gcp": [{"title": "Google Cloud Digital Leader", "provider": "Coursera", "url": "https://www.coursera.org/professional-certificates/google-cloud-digital-leader-training"}],
    "docker": [{"title": "Docker Mastery", "provider": "Udemy", "url": "https://www.udemy.com/course/docker-mastery/"}],
    "kubernetes": [{"title": "Kubernetes for the Absolute Beginners", "provider": "Udemy", "url": "https://www.udemy.com/course/learn-kubernetes/"}],
    "git": [{"title": "Git & GitHub - The Complete Guide", "provider": "Udemy", "url": "https://www.udemy.com/course/git-and-github-bootcamp/"}],
    "machine learning": [{"title": "Machine Learning Specialization", "provider": "Coursera", "url": "https://www.coursera.org/specializations/machine-learning-introduction"}],
    "deep learning": [{"title": "Deep Learning Specialization", "provider": "Coursera", "url": "https://www.coursera.org/specializations/deep-learning"}],
    "nlp": [{"title": "NLP Specialization", "provider": "Coursera", "url": "https://www.coursera.org/specializations/natural-language-processing"}],
    "data analysis": [{"title": "Google Data Analytics Certificate", "provider": "Coursera", "url": "https://www.coursera.org/professional-certificates/google-data-analytics"}],
    "pandas": [{"title": "Data Analysis with Pandas", "provider": "Udemy", "url": "https://www.udemy.com/course/data-analysis-with-pandas/"}],
    "numpy": [{"title": "NumPy for Data Science", "provider": "Udemy", "url": "https://www.udemy.com/course/numpy-for-data-science/"}],
    "tensorflow": [{"title": "TensorFlow Developer Certificate", "provider": "Coursera", "url": "https://www.coursera.org/professional-certificates/tensorflow-in-practice"}],
    "pytorch": [{"title": "PyTorch for Deep Learning", "provider": "Udemy", "url": "https://www.udemy.com/course/pytorch-for-deep-learning/"}],
    "scikit-learn": [{"title": "Machine Learning with Scikit-Learn", "provider": "Udemy", "url": "https://www.udemy.com/course/machine-learning-with-scikit-learn/"}],
    "tableau": [{"title": "Tableau 2023 A-Z", "provider": "Udemy", "url": "https://www.udemy.com/course/tableau10/"}],
    "power bi": [{"title": "Microsoft Power BI Desktop", "provider": "Udemy", "url": "https://www.udemy.com/course/microsoft-power-bi-up-running-with-power-bi-desktop/"}],
    "excel": [{"title": "Excel Skills for Business", "provider": "Coursera", "url": "https://www.coursera.org/specializations/excel"}],
    "html": [{"title": "The Web Developer Bootcamp", "provider": "Udemy", "url": "https://www.udemy.com/course/the-web-developer-bootcamp/"}],
    "css": [{"title": "CSS - The Complete Guide", "provider": "Udemy", "url": "https://www.udemy.com/course/css-the-complete-guide-incl-flexbox-grid-sass/"}],
    "tailwind": [{"title": "Tailwind CSS From Scratch", "provider": "Udemy", "url": "https://www.udemy.com/course/tailwind-from-scratch/"}],
    "rest api": [{"title": "REST APIs with Flask and Python", "provider": "Udemy", "url": "https://www.udemy.com/course/rest-api-flask-and-python/"}],
    "graphql": [{"title": "GraphQL with React", "provider": "Udemy", "url": "https://www.udemy.com/course/graphql-with-react-course/"}],
    "ci/cd": [{"title": "CI/CD with GitHub Actions", "provider": "Udemy", "url": "https://www.udemy.com/course/github-actions/"}],
    "agile": [{"title": "Agile Crash Course", "provider": "Udemy", "url": "https://www.udemy.com/course/agile-crash-course-agile-project-management-agile-delivery/"}],
    "scrum": [{"title": "Scrum Master Certification Prep", "provider": "Coursera", "url": "https://www.coursera.org/professional-certificates/scrum-master"}],
    "project management": [{"title": "Google Project Management Certificate", "provider": "Coursera", "url": "https://www.coursera.org/professional-certificates/google-project-management"}],
    "communication": [{"title": "Improving Communication Skills", "provider": "Coursera", "url": "https://www.coursera.org/learn/wharton-communication-skills"}],
    "leadership": [{"title": "Leadership Skills", "provider": "Coursera", "url": "https://www.coursera.org/learn/leadership-skills"}],
}

DEFAULT_RESOURCE = {"title": "Explore related courses", "provider": "Coursera", "url": "https://www.coursera.org/search"}

# Minimal role -> required skills catalog. Rule-based, no external calls.
ROLE_SKILL_MAP: Dict[str, List[str]] = {
    "frontend developer": ["html", "css", "javascript", "typescript", "react", "next.js", "git"],
    "backend developer": ["python", "sql", "fastapi", "django", "rest api", "docker", "git"],
    "full stack developer": ["html", "css", "javascript", "react", "node.js", "sql", "git", "rest api"],
    "data analyst": ["sql", "excel", "power bi", "tableau", "python", "data analysis", "communication"],
    "data scientist": ["python", "machine learning", "pandas", "numpy", "scikit-learn", "sql", "data analysis"],
    "machine learning engineer": ["python", "machine learning", "deep learning", "tensorflow", "pytorch", "sql"],
    "devops engineer": ["docker", "kubernetes", "aws", "ci/cd", "git", "azure"],
    "cloud engineer": ["aws", "azure", "gcp", "docker", "kubernetes"],
    "project manager": ["agile", "scrum", "project management", "communication", "leadership"],
}

DEFAULT_ROLE_SKILLS = ["communication", "git", "sql"]


def _normalize_role(target_role: str) -> str:
    return target_role.strip().lower()


def get_required_skills(target_role: str) -> List[str]:
    role_key = _normalize_role(target_role)
    if role_key in ROLE_SKILL_MAP:
        return ROLE_SKILL_MAP[role_key]
    # fuzzy fallback: partial match against known roles
    for known_role, skills in ROLE_SKILL_MAP.items():
        if role_key in known_role or known_role in role_key:
            return skills
    return DEFAULT_ROLE_SKILLS


def analyze_skill_gap(target_role: str, have_skills: List[str]) -> Dict:
    required = set(get_required_skills(target_role))
    have_set = {s.strip().lower() for s in have_skills if s and s.strip()}

    missing = sorted(required - have_set)
    have = sorted(required & have_set)

    return {
        "target_role": target_role,
        "have_skills": [s.title() for s in have],
        "missing_skills": [s.title() for s in missing],
        "recommended_courses": get_course_recommendations(missing),
    }

def get_course_recommendations(missing_skills: List[str]) -> List[Dict[str, str]]:
    seen_urls = set()
    recommendations: List[Dict[str, str]] = []
    for skill in missing_skills:
        for course in COURSE_CATALOG.get(skill.strip().lower(), []):
            if course["url"] not in seen_urls:
                seen_urls.add(course["url"])
                recommendations.append({**course, "skill": skill})
    if not recommendations and missing_skills:
        recommendations = [{**DEFAULT_RESOURCE, "skill": missing_skills[0]}]
    return recommendations