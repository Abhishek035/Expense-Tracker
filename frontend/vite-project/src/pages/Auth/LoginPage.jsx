import React, { useState } from 'react';
import { TextInput, PasswordInput, Button, Paper, Title, Text, Container, Stack, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { supabase } from '../../supabaseClient'; // Make sure this path is correct!

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        // LOGIN
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        // SIGN UP
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={80}>
      <Title ta="center" fw={700} c="dark.9">
        Welcome to FinSmart
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        {isLogin ? 'Do not have an account yet?' : 'Already have an account?'}
        <Button variant="transparent" size="sm" p={4} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Create account' : 'Log in'}
        </Button>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleAuth}>
          <Stack>
            {error && (
              <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
                {error}
              </Alert>
            )}
            {message && (
              <Alert color="teal" variant="light">
                {message}
              </Alert>
            )}

            <TextInput
              label="Email"
              placeholder="you@mantine.dev"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              mt="md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" fullWidth mt="xl" color="primary" loading={loading}>
              {isLogin ? 'Sign in' : 'Sign up'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}