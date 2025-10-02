# Log Classifier: ML & LLM-Based Log Monitoring Tool

## Overview
A log classification system that categorizes system and application logs into multiple types, including security alerts, errors, notifications, and workflow events. The project combines **regex-based matching**, **Logistic Regression**, and **BERT/LLM models** to handle both structured and complex log patterns.

- **Dataset**: 2400+ log entries (CSV)  
- **Accuracy**: 98%  
- **Deployment**:   

---

## Features
- Multi-class log classification:
  - `HTTP Status`, `Critical Error`, `Security Alert`, `System Notification`, `Resource Usage`, `User Action`, `Workflow Error`, `Deprecation Warning`  
- Hybrid approach:
  - Regex for straightforward patterns  
  - Logistic Regression and BERT for structured logs  
  - LLM for unmatched or complex logs  
- Interactive online dashboard for viewing and filtering logs  

---

## Tech Stack
- **Backend**: FastAPI  
- **Frontend**: HTML, CSS, JavaScript    

---

## Results
- Achieved **98% classification accuracy** on the training dataset  
- Successfully categorized diverse log types with minimal manual intervention  

---

## Future Improvements
- Real-time log streaming support  
- Expanded dataset with additional security events  
- Anomaly detection for unseen threats  
- Enhanced frontend visualizations