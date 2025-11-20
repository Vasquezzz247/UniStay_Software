-- ==========================================
-- V4__seed_demo_posts.sql
-- 20 propietarios demo + 20 rooms + 20 posts
-- Cada post con imagen placeholder
-- + Reseñas demo (3 por post)
-- ==========================================

-- ==========================================
-- 1) PROPIETARIOS DEMO
--  Todos usan el rol PROPIETARIO:
--  6daaaab2-732b-4442-bbcc-d11774ac9645
--  Password: mismo hash que Kevin (ya existe en tu BD)
-- ==========================================

INSERT INTO public.users (id, name, last_name, email, role_id, password) VALUES
                                                                             ('00000000-0000-0000-0000-000000000101','Lucía','Ramírez','lucia.ramirez@demo.com','6daaaab2-732b-4442-bbcc-d11774ac9645','$2a$10$jA.aaivacZiam6YZII1/Je4zR..QIqP7oK2yMHbX5fnoga6LwopKK'),
                                                                             ('00000000-0000-0000-0000-000000000102','Carlos','Domínguez','carlos.dominguez@demo.com','6daaaab2-732b-4442-bbcc-d11774ac9645','$2a$10$jA.aaivacZiam6YZII1/Je4zR..QIqP7oK2yMHbX5fnoga6LwopKK'),
                                                                             ('00000000-0000-0000-0000-000000000103','María','López','maria.lopez@demo.com','6daaaab2-732b-4442-bbcc-d11774ac9645','$2a$10$jA.aaivacZiam6YZII1/Je4zR..QIqP7oK2yMHbX5fnoga6LwopKK'),
                                                                             ('00000000-0000-0000-0000-000000000104','Jorge','Pineda','jorge.pineda@demo.com','6daaaab2-732b-4442-bbcc-d11774ac9645','$2a$10$jA.aaivacZiam6YZII1/Je4zR..QIqP7oK2yMHbX5fnoga6LwopKK'),
                                                                             ('00000000-0000-0000-0000-000000000105','Ana','Córdoba','ana.cordoba@demo.com','6daaaab2-732b-4442-bbcc-d11774ac9645','$2a$10$jA.aaivacZiam6YZII1/Je4zR..QIqP7oK2yMHbX5fnoga6LwopKK'),
                                                                             ('00000000-0000-0000-0000-000000000106','David','Ruiz','david.ruiz@demo.com','6daaaab2-732b-4442-bbcc-d11774ac9645','$2a$10$jA.aaivacZiam6YZII1/Je4zR..QIqP7oK2yMHbX5fnoga6LwopKK'),
                                                                             ('00000000-0000-0000-0000-000000000107','Elena','Fuentes','elena.fuentes@demo.com','6daaaab2-732b-4442-bbcc-d11774ac9645','$2a$10$jA.aaivacZiam6YZII1/Je4zR..QIqP7oK2yMHbX5fnoga6LwopKK'),
                                                                             ('00000000-0000-0000-0000-000000000108','Luis','Mendoza','luis.mendoza@demo.com','6daaaab2-732b-4442-bbcc-d11774ac9645','$2a$10$jA.aaivacZiam6YZII1/Je4zR..QIqP7oK2yMHbX5fnoga6LwopKK'),
                                                                             ('00000000-0000-0000-0000-000000000109','Sofía','Castro','sofia.castro@demo.com','6daaaab2-732b-4442-bbcc-d11774ac9645','$2a$10$jA.aaivacZiam6YZII1/Je4zR..QIqP7oK2yMHbX5fnoga6LwopKK'),
                                                                             ('00000000-0000-0000-0000-00000000010a','Pablo','Chávez','pablo.chavez@demo.com','6daaaab2-732b-4442-bbcc-d11774ac9645','$2a$10$jA.aaivacZiam6YZII1/Je4zR..QIqP7oK2yMHbX5fnoga6LwopKK'),
                                                                             ('00000000-0000-0000-0000-00000000010b','Valeria','Guzmán','valeria.guzman@demo.com','6daaaab2-732b-4442-bbcc-d11774ac9645','$2a$10$jA.aaivacZiam6YZII1/Je4zR..QIqP7oK2yMHbX5fnoga6LwopKK'),
                                                                             ('00000000-0000-0000-0000-00000000010c','Andrés','Rivas','andres.rivas@demo.com','6daaaab2-732b-4442-bbcc-d11774ac9645','$2a$10$jA.aaivacZiam6YZII1/Je4zR..QIqP7oK2yMHbX5fnoga6LwopKK'),
                                                                             ('00000000-0000-0000-0000-00000000010d','Camila','Morales','camila.morales@demo.com','6daaaab2-732b-4442-bbcc-d11774ac9645','$2a$10$jA.aaivacZiam6YZII1/Je4zR..QIqP7oK2yMHbX5fnoga6LwopKK'),
                                                                             ('00000000-0000-0000-0000-00000000010e','Sergio','Navarro','sergio.navarro@demo.com','6daaaab2-732b-4442-bbcc-d11774ac9645','$2a$10$jA.aaivacZiam6YZII1/Je4zR..QIqP7oK2yMHbX5fnoga6LwopKK'),
                                                                             ('00000000-0000-0000-0000-00000000010f','Paola','Salazar','paola.salazar@demo.com','6daaaab2-732b-4442-bbcc-d11774ac9645','$2a$10$jA.aaivacZiam6YZII1/Je4zR..QIqP7oK2yMHbX5fnoga6LwopKK'),
                                                                             ('00000000-0000-0000-0000-000000000110','Diego','Campos','diego.campos@demo.com','6daaaab2-732b-4442-bbcc-d11774ac9645','$2a$10$jA.aaivacZiam6YZII1/Je4zR..QIqP7oK2yMHbX5fnoga6LwopKK'),
                                                                             ('00000000-0000-0000-0000-000000000111','Fernanda','Aguilar','fernanda.aguilar@demo.com','6daaaab2-732b-4442-bbcc-d11774ac9645','$2a$10$jA.aaivacZiam6YZII1/Je4zR..QIqP7oK2yMHbX5fnoga6LwopKK'),
                                                                             ('00000000-0000-0000-0000-000000000112','Ricardo','Peralta','ricardo.peralta@demo.com','6daaaab2-732b-4442-bbcc-d11774ac9645','$2a$10$jA.aaivacZiam6YZII1/Je4zR..QIqP7oK2yMHbX5fnoga6LwopKK'),
                                                                             ('00000000-0000-0000-0000-000000000113','Laura','Villalobos','laura.villalobos@demo.com','6daaaab2-732b-4442-bbcc-d11774ac9645','$2a$10$jA.aaivacZiam6YZII1/Je4zR..QIqP7oK2yMHbX5fnoga6LwopKK'),
                                                                             ('00000000-0000-0000-0000-000000000114','Héctor','Santos','hector.santos@demo.com','6daaaab2-732b-4442-bbcc-d11774ac9645','$2a$10$jA.aaivacZiam6YZII1/Je4zR..QIqP7oK2yMHbX5fnoga6LwopKK');

-- Asignar rol PROPIETARIO en tabla M2M user_roles
INSERT INTO public.user_roles (user_id, role_id) VALUES
                                                     ('00000000-0000-0000-0000-000000000101','6daaaab2-732b-4442-bbcc-d11774ac9645'),
                                                     ('00000000-0000-0000-0000-000000000102','6daaaab2-732b-4442-bbcc-d11774ac9645'),
                                                     ('00000000-0000-0000-0000-000000000103','6daaaab2-732b-4442-bbcc-d11774ac9645'),
                                                     ('00000000-0000-0000-0000-000000000104','6daaaab2-732b-4442-bbcc-d11774ac9645'),
                                                     ('00000000-0000-0000-0000-000000000105','6daaaab2-732b-4442-bbcc-d11774ac9645'),
                                                     ('00000000-0000-0000-0000-000000000106','6daaaab2-732b-4442-bbcc-d11774ac9645'),
                                                     ('00000000-0000-0000-0000-000000000107','6daaaab2-732b-4442-bbcc-d11774ac9645'),
                                                     ('00000000-0000-0000-0000-000000000108','6daaaab2-732b-4442-bbcc-d11774ac9645'),
                                                     ('00000000-0000-0000-0000-000000000109','6daaaab2-732b-4442-bbcc-d11774ac9645'),
                                                     ('00000000-0000-0000-0000-00000000010a','6daaaab2-732b-4442-bbcc-d11774ac9645'),
                                                     ('00000000-0000-0000-0000-00000000010b','6daaaab2-732b-4442-bbcc-d11774ac9645'),
                                                     ('00000000-0000-0000-0000-00000000010c','6daaaab2-732b-4442-bbcc-d11774ac9645'),
                                                     ('00000000-0000-0000-0000-00000000010d','6daaaab2-732b-4442-bbcc-d11774ac9645'),
                                                     ('00000000-0000-0000-0000-00000000010e','6daaaab2-732b-4442-bbcc-d11774ac9645'),
                                                     ('00000000-0000-0000-0000-00000000010f','6daaaab2-732b-4442-bbcc-d11774ac9645'),
                                                     ('00000000-0000-0000-0000-000000000110','6daaaab2-732b-4442-bbcc-d11774ac9645'),
                                                     ('00000000-0000-0000-0000-000000000111','6daaaab2-732b-4442-bbcc-d11774ac9645'),
                                                     ('00000000-0000-0000-0000-000000000112','6daaaab2-732b-4442-bbcc-d11774ac9645'),
                                                     ('00000000-0000-0000-0000-000000000113','6daaaab2-732b-4442-bbcc-d11774ac9645'),
                                                     ('00000000-0000-0000-0000-000000000114','6daaaab2-732b-4442-bbcc-d11774ac9645');

-- ==========================================
-- 2) ROOMS DEMO (uno por propietario)
-- ==========================================

INSERT INTO public.rooms (id, description, address, available, user_id, bathroom_type, is_furnished, kitchen_type, square_footage)
VALUES
    ('00000000-0000-0000-0000-000000001001','Habitación luminosa cerca de la UCA','Colonia Universitaria 1',true,'00000000-0000-0000-0000-000000000101','Privado',true,'Compartida',18),
    ('00000000-0000-0000-0000-000000001002','Estudio completo con baño privado','Colonia Médica 2',true,'00000000-0000-0000-0000-000000000102','Privado',true,'Privada',25),
    ('00000000-0000-0000-0000-000000001003','Cuarto sencillo económico','Centro Histórico 3',true,'00000000-0000-0000-0000-000000000103','Compartido',false,'Compartida',14),
    ('00000000-0000-0000-0000-000000001004','Habitación con vista a la ciudad','Colonia Escalón 4',true,'00000000-0000-0000-0000-000000000104','Privado',true,'Privada',20),
    ('00000000-0000-0000-0000-000000001005','Habitación individual cerca de terminal','Colonia San Luis 5',true,'00000000-0000-0000-0000-000000000105','Compartido',false,'Compartida',15),
    ('00000000-0000-0000-0000-000000001006','Mini loft moderno','Zona Rosa 6',true,'00000000-0000-0000-0000-000000000106','Privado',true,'Privada',28),
    ('00000000-0000-0000-0000-000000001007','Cuarto en casa familiar tranquila','Colonia Miramonte 7',true,'00000000-0000-0000-0000-000000000107','Compartido',true,'Compartida',16),
    ('00000000-0000-0000-0000-000000001008','Habitación amplia para dos personas','Colonia Libertad 8',true,'00000000-0000-0000-0000-000000000108','Privado',true,'Compartida',22),
    ('00000000-0000-0000-0000-000000001009','Habitación cerca de parada de bus','Colonia Flor Blanca 9',true,'00000000-0000-0000-0000-000000000109','Compartido',false,'Compartida',13),
    ('00000000-0000-0000-0000-00000000100a','Habitación con balcón y escritorio','Colonia Maquilishuat 10',true,'00000000-0000-0000-0000-00000000010a','Privado',true,'Privada',19),
    ('00000000-0000-0000-0000-00000000100b','Cuarto pequeño pero cómodo','Colonia Las Margaritas 11',true,'00000000-0000-0000-0000-00000000010b','Compartido',false,'Compartida',12),
    ('00000000-0000-0000-0000-00000000100c','Habitación en apartamento compartido','Colonia San Benito 12',true,'00000000-0000-0000-0000-00000000010c','Compartido',true,'Compartida',17),
    ('00000000-0000-0000-0000-00000000100d','Cuarto con aire acondicionado','Colonia Miralvalle 13',true,'00000000-0000-0000-0000-00000000010d','Privado',true,'Privada',21),
    ('00000000-0000-0000-0000-00000000100e','Habitación económica para estudiante','Colonia Zacamil 14',true,'00000000-0000-0000-0000-00000000010e','Compartido',false,'Compartida',14),
    ('00000000-0000-0000-0000-00000000100f','Habitación cerca de facultad de ingeniería','Ciudad Universitaria 15',true,'00000000-0000-0000-0000-00000000010f','Privado',true,'Compartida',18),
    ('00000000-0000-0000-0000-000000001010','Habitación tipo estudio con kitchenette','Colonia Médica 16',true,'00000000-0000-0000-0000-000000000110','Privado',true,'Privada',24),
    ('00000000-0000-0000-0000-000000001011','Habitación compartida femenina','Colonia Centroamérica 17',true,'00000000-0000-0000-0000-000000000111','Compartido',true,'Compartida',20),
    ('00000000-0000-0000-0000-000000001012','Habitación en casa de familia cerca de la U','Colonia Costa Rica 18',true,'00000000-0000-0000-0000-000000000112','Compartido',true,'Compartida',16),
    ('00000000-0000-0000-0000-000000001013','Habitación con terraza compartida','Colonia San Francisco 19',true,'00000000-0000-0000-0000-000000000113','Privado',true,'Compartida',19),
    ('00000000-0000-0000-0000-000000001014','Habitación premium amueblada','Colonia Escalón 20',true,'00000000-0000-0000-0000-000000000114','Privado',true,'Privada',30);

-- ==========================================
-- 3) POSTS DEMO (uno por room)
--    Usamos estado 'DISPONIBLE'
-- ==========================================

INSERT INTO public.posts (id, title, price, status, user_id, room_id, maximum_lease_term, minimum_lease_term, security_deposit)
VALUES
    ('00000000-0000-0000-0000-000000002001','Habitación luminosa cerca de la UCA',180,'DISPONIBLE','00000000-0000-0000-0000-000000000101','00000000-0000-0000-0000-000000001001','12 meses','3 meses',80),
    ('00000000-0000-0000-0000-000000002002','Estudio completo en Colonia Médica',260,'DISPONIBLE','00000000-0000-0000-0000-000000000102','00000000-0000-0000-0000-000000001002','12 meses','6 meses',120),
    ('00000000-0000-0000-0000-000000002003','Cuarto sencillo económico en el centro',120,'DISPONIBLE','00000000-0000-0000-0000-000000000103','00000000-0000-0000-0000-000000001003','6 meses','3 meses',60),
    ('00000000-0000-0000-0000-000000002004','Habitación con vista a la ciudad',230,'DISPONIBLE','00000000-0000-0000-0000-000000000104','00000000-0000-0000-0000-000000001004','12 meses','6 meses',100),
    ('00000000-0000-0000-0000-000000002005','Habitación individual cerca de terminal',150,'DISPONIBLE','00000000-0000-0000-0000-000000000105','00000000-0000-0000-0000-000000001005','9 meses','3 meses',70),
    ('00000000-0000-0000-0000-000000002006','Mini loft moderno en Zona Rosa',300,'DISPONIBLE','00000000-0000-0000-0000-000000000106','00000000-0000-0000-0000-000000001006','12 meses','6 meses',150),
    ('00000000-0000-0000-0000-000000002007','Cuarto en casa familiar tranquila',170,'DISPONIBLE','00000000-0000-0000-0000-000000000107','00000000-0000-0000-0000-000000001007','12 meses','4 meses',80),
    ('00000000-0000-0000-0000-000000002008','Habitación amplia para dos personas',240,'DISPONIBLE','00000000-0000-0000-0000-000000000108','00000000-0000-0000-0000-000000001008','12 meses','6 meses',120),
    ('00000000-0000-0000-0000-000000002009','Habitación cerca de parada de bus',140,'DISPONIBLE','00000000-0000-0000-0000-000000000109','00000000-0000-0000-0000-000000001009','9 meses','3 meses',60),
    ('00000000-0000-0000-0000-00000000200a','Habitación con balcón y escritorio',210,'DISPONIBLE','00000000-0000-0000-0000-00000000010a','00000000-0000-0000-0000-00000000100a','12 meses','4 meses',100),
    ('00000000-0000-0000-0000-00000000200b','Cuarto pequeño pero cómodo',130,'DISPONIBLE','00000000-0000-0000-0000-00000000010b','00000000-0000-0000-0000-00000000100b','6 meses','3 meses',50),
    ('00000000-0000-0000-0000-00000000200c','Habitación en apartamento compartido',190,'DISPONIBLE','00000000-0000-0000-0000-00000000010c','00000000-0000-0000-0000-00000000100c','12 meses','4 meses',90),
    ('00000000-0000-0000-0000-00000000200d','Cuarto con aire acondicionado',220,'DISPONIBLE','00000000-0000-0000-0000-00000000010d','00000000-0000-0000-0000-00000000100d','12 meses','6 meses',110),
    ('00000000-0000-0000-0000-00000000200e','Habitación económica para estudiante',140,'DISPONIBLE','00000000-0000-0000-0000-00000000010e','00000000-0000-0000-0000-00000000100e','9 meses','3 meses',60),
    ('00000000-0000-0000-0000-00000000200f','Habitación cerca de facultad de ingeniería',200,'DISPONIBLE','00000000-0000-0000-0000-00000000010f','00000000-0000-0000-0000-00000000100f','12 meses','4 meses',90),
    ('00000000-0000-0000-0000-000000002010','Estudio con kitchenette en Colonia Médica',270,'DISPONIBLE','00000000-0000-0000-0000-000000000110','00000000-0000-0000-0000-000000001010','12 meses','6 meses',130),
    ('00000000-0000-0000-0000-000000002011','Habitación compartida femenina',160,'DISPONIBLE','00000000-0000-0000-0000-000000000111','00000000-0000-0000-0000-000000001011','9 meses','3 meses',70),
    ('00000000-0000-0000-0000-000000002012','Habitación en casa de familia cerca de la U',170,'DISPONIBLE','00000000-0000-0000-0000-000000000112','00000000-0000-0000-0000-000000001012','9 meses','3 meses',70),
    ('00000000-0000-0000-0000-000000002013','Habitación con terraza compartida',210,'DISPONIBLE','00000000-0000-0000-0000-000000000113','00000000-0000-0000-0000-000000001013','12 meses','4 meses',90),
    ('00000000-0000-0000-0000-000000002014','Habitación premium amueblada en Escalón',320,'DISPONIBLE','00000000-0000-0000-0000-000000000114','00000000-0000-0000-0000-000000001014','12 meses','6 meses',160);

-- ==========================================
-- 4) IMÁGENES DEMO (post_images)
--    Usamos placeholders de picsum.photos
-- ==========================================

INSERT INTO public.post_images (id, display_order, image_url, post_id)
VALUES
    ('00000000-0000-0000-0000-000000003001',0,'https://picsum.photos/seed/unistay01/1200/600','00000000-0000-0000-0000-000000002001'),
    ('00000000-0000-0000-0000-000000003002',0,'https://picsum.photos/seed/unistay02/1200/600','00000000-0000-0000-0000-000000002002'),
    ('00000000-0000-0000-0000-000000003003',0,'https://picsum.photos/seed/unistay03/1200/600','00000000-0000-0000-0000-000000002003'),
    ('00000000-0000-0000-0000-000000003004',0,'https://picsum.photos/seed/unistay04/1200/600','00000000-0000-0000-0000-000000002004'),
    ('00000000-0000-0000-0000-000000003005',0,'https://picsum.photos/seed/unistay05/1200/600','00000000-0000-0000-0000-000000002005'),
    ('00000000-0000-0000-0000-000000003006',0,'https://picsum.photos/seed/unistay06/1200/600','00000000-0000-0000-0000-000000002006'),
    ('00000000-0000-0000-0000-000000003007',0,'https://picsum.photos/seed/unistay07/1200/600','00000000-0000-0000-0000-000000002007'),
    ('00000000-0000-0000-0000-000000003008',0,'https://picsum.photos/seed/unistay08/1200/600','00000000-0000-0000-0000-000000002008'),
    ('00000000-0000-0000-0000-000000003009',0,'https://picsum.photos/seed/unistay09/1200/600','00000000-0000-0000-0000-000000002009'),
    ('00000000-0000-0000-0000-00000000300a',0,'https://picsum.photos/seed/unistay10/1200/600','00000000-0000-0000-0000-00000000200a'),
    ('00000000-0000-0000-0000-00000000300b',0,'https://picsum.photos/seed/unistay11/1200/600','00000000-0000-0000-0000-00000000200b'),
    ('00000000-0000-0000-0000-00000000300c',0,'https://picsum.photos/seed/unistay12/1200/600','00000000-0000-0000-0000-00000000200c'),
    ('00000000-0000-0000-0000-00000000300d',0,'https://picsum.photos/seed/unistay13/1200/600','00000000-0000-0000-0000-00000000200d'),
    ('00000000-0000-0000-0000-00000000300e',0,'https://picsum.photos/seed/unistay14/1200/600','00000000-0000-0000-0000-00000000200e'),
    ('00000000-0000-0000-0000-00000000300f',0,'https://picsum.photos/seed/unistay15/1200/600','00000000-0000-0000-0000-00000000200f'),
    ('00000000-0000-0000-0000-000000003010',0,'https://picsum.photos/seed/unistay16/1200/600','00000000-0000-0000-0000-000000002010'),
    ('00000000-0000-0000-0000-000000003011',0,'https://picsum.photos/seed/unistay17/1200/600','00000000-0000-0000-0000-000000002011'),
    ('00000000-0000-0000-0000-000000003012',0,'https://picsum.photos/seed/unistay18/1200/600','00000000-0000-0000-0000-000000002012'),
    ('00000000-0000-0000-0000-000000003013',0,'https://picsum.photos/seed/unistay19/1200/600','00000000-0000-0000-0000-000000002013'),
    ('00000000-0000-0000-0000-000000003014',0,'https://picsum.photos/seed/unistay20/1200/600','00000000-0000-0000-0000-000000002014');

-- ==========================================
-- 5) REVIEWS DEMO (3 por post)
--    Usamos los mismos usuarios demo como autores
--    Tabla asumida: public.reviews
-- ==========================================
