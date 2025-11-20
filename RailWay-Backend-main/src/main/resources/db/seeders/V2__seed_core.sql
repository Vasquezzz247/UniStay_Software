-- =========================
-- V2__seed_core.sql  (SEEDS)
-- =========================

-- ROLES base
INSERT INTO public.roles (id, role) VALUES
                                        ('838db61d-054f-46d6-91ef-924ef00b5486','ADMIN'),
                                        ('e624df50-877c-4690-a9ff-6af9e69f668a','ESTUDIANTE'),
                                        ('6daaaab2-732b-4442-bbcc-d11774ac9645','PROPIETARIO'),
                                        ('4f4e1ca2-7a0a-4ee5-b146-3fac2afe0f87','USER')
    ON CONFLICT (id) DO NOTHING;

-- Usuario admin + propietario demo (password ya en BCrypt)
INSERT INTO public.users (id, name, last_name, email, role_id, password) VALUES
                                                                             ('7f7f9735-359e-4bb6-acf0-2ab184881165','Claudia','Herrera','Claudia@gmail.com','838db61d-054f-46d6-91ef-924ef00b5486',
                                                                              '$2a$10$0qV71N.It26/yWWy1zb.dueBlUmJ6aPfBbUNKTI00Y9q6oGF8cPLy'),
                                                                             ('e03cb4a6-6ee9-4c89-b1ce-0ae588c8d559','Kevin','Martinez','Kevinmc@gmail.com','6daaaab2-732b-4442-bbcc-d11774ac9645',
                                                                              '$2a$10$jA.aaivacZiam6YZII1/Je4zR..QIqP7oK2yMHbX5fnoga6LwopKK')
    ON CONFLICT (id) DO NOTHING;

-- M2M roles para admin
INSERT INTO public.user_roles (user_id, role_id) VALUES
                                                     ('7f7f9735-359e-4bb6-acf0-2ab184881165','838db61d-054f-46d6-91ef-924ef00b5486'),
                                                     ('7f7f9735-359e-4bb6-acf0-2ab184881165','6daaaab2-732b-4442-bbcc-d11774ac9645')
    ON CONFLICT DO NOTHING;

-- Room demo
INSERT INTO public.rooms (id, description, address, available, user_id, bathroom_type, is_furnished, kitchen_type, square_footage)
VALUES (
           'a6c7c698-d75c-44fc-be8a-c69a4749fcef',
           'Habitación individual amueblada',
           'Calle Principal 123',
           true,
           'e03cb4a6-6ee9-4c89-b1ce-0ae588c8d559',
           'Compartido',
           true,
           'Compartida',
           16
       )
    ON CONFLICT (id) DO NOTHING;