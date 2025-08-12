import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    phoneNumber: '+46701234567',
    password: '',
    firstName: '',
    lastName: '',
    email: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLoginMode) {
        const result = await login({
          phoneNumber: formData.phoneNumber,
          password: formData.password
        });
        
        if (result.success) {
          navigate('/');
        } else {
          setError(result.error || 'Login failed');
        }
      } else {
        const result = await register({
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email
        });
        
        if (result.success) {
          setError('');
          setIsLoginMode(true);
          // Show success message
          alert('Registrering lyckades! Du kan nu logga in.');
        } else {
          setError(result.error || 'Registration failed');
        }
      }
    } catch (error) {
      setError('Ett oväntat fel inträffade');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-6 bg-gradient-card shadow-card border-0">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-primary mb-2">Swish</h1>
          <p className="text-muted-foreground">
            {isLoginMode ? 'Logga in på ditt konto' : 'Skapa ett nytt konto'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="phoneNumber">Telefonnummer</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="+46701234567"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>

          {!isLoginMode && (
            <>
              <div>
                <Label htmlFor="firstName">Förnamn</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="lastName">Efternamn</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">E-post</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="password">Lösenord</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Laddar...' : (isLoginMode ? 'Logga in' : 'Registrera')}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError('');
              setFormData({
                phoneNumber: '',
                password: '',
                firstName: '',
                lastName: '',
                email: ''
              });
            }}
            className="text-primary hover:underline"
          >
            {isLoginMode ? 'Skapa nytt konto' : 'Har redan ett konto? Logga in'}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
