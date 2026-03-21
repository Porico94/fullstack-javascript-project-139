import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import { Form, Button } from "react-bootstrap";
import * as Yup from 'yup';
import AuthContext from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";

const SignupPage = () => {
    const { t } = useTranslation();
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();
    const [signupError, setSignupError] = useState('');

    const formik = useFormik({
    initialValues: {
        username: '',
        password: '',
        confirmPassword: ''
    },
    validationSchema: Yup.object({
        username: Yup.string()
            .min(3, t('signup.errors.usernameTooShort'))
            .max(20, t('signup.errors.usernameTooLong'))
            .required(t('signup.errors.usernameRequired')),
        password: Yup.string()
            .min(6, t('signup.errors.passwordTooShort'))
            .required(t('signup.errors.passwordRequired')),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], t('signup.errors.passwordsMustMatch'))
            .required(t('signup.errors.confirmPasswordRequired'))
    }),
    onSubmit: async (values) => {
        setSignupError('');
        const result = await signup(values.username, values.password);

        if (result.success) {
            navigate('/');
        } else {

            let errorMessage;
        
            switch (result.errorCode) {
                case 'USER_EXISTS':
                errorMessage = t('signup.errors.userExists', { username: result.username });
            break;
            case 'CONNECTION_ERROR':
                errorMessage = t('signup.errors.connectionError');
                break;
            default:
                errorMessage = t('signup.errors.connectionError');
        }
            setSignupError(errorMessage);           
        }
    }
    });

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh',
            backgroundColor: '#f5f5f5'
        }}>
            <div style={{ 
                width: '100%', 
                maxWidth: '400px', 
                padding: '2rem', 
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>{t('signup.title')}</h2>

                <Form onSubmit={formik.handleSubmit}>
                    <Form.Group style={{ marginBottom: '1rem' }}>
                        <Form.Label>{t('common.username')}</Form.Label>
                        <Form.Control
                            name="username"
                            type='text'
                            value={formik.values.username}
                            placeholder={t('signup.usernamePlaceholder')}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.username && formik.errors.username}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.username}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group style={{ marginBottom: '1rem' }}>
                        <Form.Label>{t('common.password')}</Form.Label>
                        <Form.Control
                            name="password"
                            type='password'
                            value={formik.values.password}
                            placeholder={t('signup.passwordPlaceholder')}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.password && formik.errors.password}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.password}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group style={{ marginBottom: '1rem' }}>
                        <Form.Label>{t('signup.confirmPasswordLabel')}</Form.Label>
                        <Form.Control
                            name="confirmPassword"
                            type='password'
                            value={formik.values.confirmPassword}
                            placeholder={t('signup.confirmPasswordPlaceholder')}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.confirmPassword && formik.errors.confirmPassword}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.confirmPassword}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {signupError && (
                    <div style={{ 
                        padding: '0.75rem', 
                        marginBottom: '1rem', 
                        backgroundColor: '#f8d7da', 
                        color: '#721c24',
                        border: '1px solid #f5c6cb',
                        borderRadius: '4px'
                    }}>
                        {signupError}
                    </div>
                    )}
                    
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={formik.isSubmitting}
                        style={{width: '100%', marginBottom: '1rem'}}
                    >
                        {formik.isSubmitting ? t('signup.submitting') : t('signup.submitButton')}
                    </Button>

                    <div style={{ textAlign: 'center' }}>
                        <span>{t('signup.hasAccount')} </span>
                        <Link to="/login">{t('signup.loginLink')}</Link>
                    </div>            
                </Form>
            </div>
        </div>
    );
};

export default SignupPage;