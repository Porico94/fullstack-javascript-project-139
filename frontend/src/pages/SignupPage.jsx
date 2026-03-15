import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import { Form, Button } from "react-bootstrap";
import * as Yup from 'yup';
import AuthContext from "../contexts/AuthContext";

const SignupPage = () => {
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
            .min(3, 'El username debe tener al menos 3 caracteres')
            .max(20, 'El nombre debe tener máximo 20 caracteres')
            .required('El nombre de usuario es obligatorio'),
        password: Yup.string()
            .min(6, 'La contraseña debe tener al menos 6 caracteres')
            .required('La contraseña es obligatoria'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
            .required('Confirma tu contraseña')
    }),
    onSubmit: async (values) => {
        setSignupError('');
        const result = await signup(values.username, values.password);

        if (result.success) {
            navigate('/');
        } else {
            setSignupError(result.message);           
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
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Registro</h2>

                <Form onSubmit={formik.handleSubmit}>
                    <Form.Group style={{ marginBottom: '1rem' }}>
                        <Form.Label>Nombre de usuario</Form.Label>
                        <Form.Control
                            name="username"
                            type='text'
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.username && formik.errors.username}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.username}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group style={{ marginBottom: '1rem' }}>
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control
                            name="password"
                            type='password'
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.password && formik.errors.password}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.password}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group style={{ marginBottom: '1rem' }}>
                        <Form.Label>Confirmar Contraseña </Form.Label>
                        <Form.Control
                            name="confirmPassword"
                            type='password'
                            value={formik.values.confirmPassword}
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
                        {formik.isSubmitting ? 'Registrando...' : 'Registrarse'}
                    </Button>

                    <div style={{ textAlign: 'center' }}>
                        <span>¿Ya tienes cuenta? </span>
                        <Link to="/login">Iniciar sesión</Link>
                    </div>            
                </Form>
            </div>
        </div>
    );
};

export default SignupPage;