/*
  Warnings:

  - The values [domingo,sabado] on the enum `horarios_medicos_day_of_week` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `horarios_medicos` MODIFY `day_of_week` ENUM('segunda', 'terca', 'quarta', 'quinta', 'sexta') NOT NULL;
