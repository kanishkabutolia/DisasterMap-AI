# Contributing to DisasterMap AI

We welcome contributions to DisasterMap AI! This document provides guidelines for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our code of conduct:
- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain a professional attitude

## How to Contribute

### Reporting Issues

1. **Check existing issues** first to avoid duplicates
2. **Use clear, descriptive titles** for new issues
3. **Include detailed descriptions** with:
   - Steps to reproduce the issue
   - Expected vs actual behavior
   - System information (OS, Python version, browser)
   - Screenshots if applicable

### Feature Requests

1. **Describe the feature** clearly and concisely
2. **Explain the use case** and benefits
3. **Provide examples** if possible
4. **Consider backward compatibility**

### Pull Requests

1. **Fork the repository** to your GitHub account
2. **Create a new branch** for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following our coding standards
4. **Test thoroughly** before submitting
5. **Write clear commit messages**
6. **Update documentation** if needed
7. **Submit a pull request** with:
   - Clear description of changes
   - Reference to related issues
   - Testing information

## Development Setup

### Environment Setup

1. **Clone your fork**:
   ```bash
   git clone https://github.com/yourusername/DisasterMap-AI.git
   cd DisasterMap-AI
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

### Running Tests

```bash
# Run the application locally
python run_local.py

# Test API endpoints
curl http://localhost:5000/api/weather/40.7128/-74.0060
```

## Coding Standards

### Python Code Style

- Follow **PEP 8** guidelines
- Use **meaningful variable names**
- Add **docstrings** for functions and classes
- Keep functions **focused and small**
- Use **type hints** where appropriate

Example:
```python
def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate distance between two points using Haversine formula.
    
    Args:
        lat1: Latitude of first point
        lon1: Longitude of first point
        lat2: Latitude of second point
        lon2: Longitude of second point
        
    Returns:
        Distance in kilometers
    """
    # Implementation here
```

### JavaScript Code Style

- Use **ES6+ features** where appropriate
- Use **consistent indentation** (2 spaces)
- Add **comments** for complex logic
- Use **meaningful function names**
- Handle **errors gracefully**

Example:
```javascript
/**
 * Toggle disaster layer visibility on map
 * @param {string} layerType - Type of disaster layer
 * @param {boolean} show - Whether to show or hide layer
 */
async toggleLayer(layerType, show) {
    // Implementation here
}
```

### HTML/CSS Standards

- Use **semantic HTML5** elements
- Follow **accessibility guidelines**
- Use **Bootstrap classes** consistently
- Keep **CSS organized** and commented
- Ensure **responsive design**

## Project Structure

### Adding New Features

1. **Backend changes**: Add to `app.py` or create new modules
2. **Frontend changes**: Modify `dashboard.js` or add new files
3. **Data changes**: Update GeoJSON files in `data/` directory
4. **ML features**: Add to `ml_model/` directory

### File Organization

```
DisasterMap-AI/
├── app.py                    # Main Flask application
├── weather_api.py            # Weather integration
├── utils.py                  # Utility functions
├── ml_model/                 # Machine learning modules
├── data/                     # Disaster data files
├── templates/                # HTML templates
├── static/                   # CSS/JS/Images
└── tests/                    # Test files
```

## Documentation

### Code Documentation

- Add **docstrings** for all functions and classes
- Include **parameter descriptions** and **return values**
- Use **clear, concise language**
- Provide **usage examples** where helpful

### README Updates

- Update **installation instructions** if dependencies change
- Add **usage examples** for new features
- Update **API documentation** for new endpoints
- Include **screenshots** for UI changes

## Testing Guidelines

### Manual Testing

1. **Test all user flows** thoroughly
2. **Check responsive design** on different devices
3. **Verify API endpoints** work correctly
4. **Test error handling** scenarios
5. **Validate data export** functionality

### Automated Testing

- Add **unit tests** for new functions
- Include **integration tests** for API endpoints
- Test **error conditions** and edge cases
- Ensure **backward compatibility**

## Deployment

### Local Development

```bash
python run_local.py
```

### Production Deployment

```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## Review Process

### Code Review Checklist

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance impact considered
- [ ] Backward compatibility maintained

### Merge Requirements

- Minimum **one approval** from maintainers
- All **automated checks** must pass
- **Documentation** must be updated
- **No merge conflicts** with main branch

## Community

### Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **Discussions**: For questions and general discussion
- **Wiki**: For detailed documentation and tutorials

### Recognition

Contributors will be recognized in:
- **Contributors section** of README
- **Release notes** for significant contributions
- **Project documentation** for major features

## License

By contributing to DisasterMap AI, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to DisasterMap AI! Your efforts help improve disaster preparedness and response capabilities worldwide.