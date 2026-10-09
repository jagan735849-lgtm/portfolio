import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaLock, FaEnvelope, FaShieldAlt, FaKey, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const queryParams = new URLSearchParams(location.search);
  const isExpired = queryParams.get('expired') === 'true';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: 'admin@portfolio.local',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setErrorMsg(null);
      await login(data);
      navigate('/admin');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setValue('email', 'admin@portfolio.local');
    setValue('password', 'AdminPassword123!');
  };

  return (
    <div className="py-5 d-flex align-items-center" style={{ minHeight: '80vh' }}>
      <Container style={{ maxWidth: '460px' }}>
        <div className="text-center mb-4">
          <div
            className="d-inline-flex p-3 rounded-circle text-white mb-3"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              boxShadow: '0 8px 20px rgba(59, 130, 246, 0.35)',
            }}
          >
            <FaShieldAlt size={32} />
          </div>
          <h2 className="fw-bold mb-1">Admin Portal</h2>
          <p className="text-muted small">
            Sign in to manage projects, skills, experience, and contact messages.
          </p>
        </div>

        {isExpired && (
          <Alert variant="warning" className="small text-center mb-3">
            Your session has expired. Please log in again to continue.
          </Alert>
        )}

        {errorMsg && (
          <Alert variant="danger" className="small text-center mb-3">
            {errorMsg}
          </Alert>
        )}

        <Card className="custom-card p-4 p-md-5">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label className="small fw-semibold">Admin Email</Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0 text-muted">
                  <FaEnvelope size={14} />
                </span>
                <Form.Control
                  type="email"
                  placeholder="admin@portfolio.local"
                  className="border-start-0"
                  isInvalid={!!errors.email}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: 'Valid email required',
                    },
                  })}
                />
              </div>
              {errors.email && (
                <div className="text-danger small mt-1">{errors.email.message}</div>
              )}
            </Form.Group>

            <Form.Group className="mb-4" controlId="loginPassword">
              <Form.Label className="small fw-semibold">Password</Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0 text-muted">
                  <FaLock size={14} />
                </span>
                <Form.Control
                  type="password"
                  placeholder="••••••••••••"
                  className="border-start-0"
                  isInvalid={!!errors.password}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                />
              </div>
              {errors.password && (
                <div className="text-danger small mt-1">{errors.password.message}</div>
              )}
            </Form.Group>

            <Button
              type="submit"
              disabled={loading}
              className="btn-primary-gradient w-100 py-2 d-flex align-items-center justify-content-center gap-2 mb-3"
            >
              <FaKey size={14} />
              <span>{loading ? 'Authenticating...' : 'Sign In as Administrator'}</span>
            </Button>

            {/* Quick Demo Fill Helper */}
            <div className="p-3 rounded-3 bg-body-tertiary border text-center small mb-3">
              <div className="text-muted mb-1">Quick Evaluation Credential:</div>
              <div className="font-monospace fw-semibold text-primary">
                admin@portfolio.local / AdminPassword123!
              </div>
              <Button
                variant="link"
                size="sm"
                onClick={fillDemoCredentials}
                className="text-decoration-none p-0 mt-1 small"
              >
                Auto-fill credentials
              </Button>
            </div>

            <div className="text-center pt-2">
              <Link to="/" className="text-muted small text-decoration-none d-inline-flex align-items-center gap-1">
                <FaArrowLeft size={11} />
                <span>Return to Public Website</span>
              </Link>
            </div>
          </Form>
        </Card>
      </Container>
    </div>
  );
};
