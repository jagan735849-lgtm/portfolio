import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, ProgressBar, Form, InputGroup, Button } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { skillService } from '../services/skillService';
import { ISkill } from '../types';

export const SkillsPage: React.FC = () => {
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const res = await skillService.getSkills();
        if (res.success && res.data) {
          setSkills(res.data);
        }
      } catch (err) {
        console.error('Failed to load skills:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const categories = [
    { key: 'all', label: 'All Skills' },
    { key: 'frontend', label: 'Frontend' },
    { key: 'backend', label: 'Backend' },
    { key: 'database', label: 'Databases' },
    { key: 'programming', label: 'Programming' },
    { key: 'tools', label: 'Tools & DevOps' },
  ];

  const filteredSkills = skills.filter((skill) => {
    const matchesCategory =
      selectedCategory === 'all' || skill.category === selectedCategory;
    const matchesSearch =
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <LoadingSpinner message="Loading technical skills..." />;
  }

  return (
    <div className="py-5">
      <Container>
        <div className="text-center mx-auto mb-5" style={{ maxWidth: '650px' }}>
          <span className="text-primary text-uppercase fw-semibold small tracking-widest">
            Capabilities
          </span>
          <h1 className="display-5 fw-bold mt-1">Technical Skills</h1>
          <p className="lead text-muted">
            Specialized technologies, languages, and modern tools I leverage to build scalable software solutions.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-5">
          <Row className="gy-3 align-items-center justify-content-between">
            <Col md={8}>
              <div className="d-flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat.key}
                    variant={selectedCategory === cat.key ? 'primary' : 'outline-secondary'}
                    size="sm"
                    className="rounded-pill px-3 py-1"
                    onClick={() => setSelectedCategory(cat.key)}
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
            </Col>

            <Col md={4}>
              <InputGroup size="sm">
                <InputGroup.Text className="bg-transparent border-end-0">
                  <BsSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search skill (e.g. React, Docker)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-start-0"
                />
                {searchTerm && (
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear
                  </Button>
                )}
              </InputGroup>
            </Col>
          </Row>
        </div>

        {/* Skills Grid */}
        {filteredSkills.length === 0 ? (
          <EmptyState
            title="No skills found"
            description="No technical skills matched your current category or search query."
            actionText="Reset Filters"
            onAction={() => {
              setSelectedCategory('all');
              setSearchTerm('');
            }}
          />
        ) : (
          <Row className="gy-4">
            {filteredSkills.map((skill) => (
              <Col key={skill._id} sm={6} lg={4}>
                <Card className="custom-card h-100 p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">{skill.name}</h5>
                    <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-3 py-1 small">
                      {skill.level}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-1 small text-muted">
                    <span className="text-uppercase tracking-wider" style={{ fontSize: '0.72rem' }}>
                      {skill.category}
                    </span>
                    <span className="fw-bold text-body">{skill.proficiency}%</span>
                  </div>

                  <ProgressBar
                    now={skill.proficiency}
                    variant={
                      skill.proficiency >= 90
                        ? 'primary'
                        : skill.proficiency >= 80
                        ? 'info'
                        : 'secondary'
                    }
                    style={{ height: '7px', borderRadius: '4px' }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};
