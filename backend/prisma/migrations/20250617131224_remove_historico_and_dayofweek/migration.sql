/*
  Warnings:

  - You are about to drop the column `day_of_week` on the `horarios_medicos` table. All the data in the column will be lost.
  - You are about to drop the `historicos_consultas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `historicos_consultas` DROP FOREIGN KEY `historicos_consultas_consulta_id_fkey`;

-- DropForeignKey
ALTER TABLE `historicos_consultas` DROP FOREIGN KEY `historicos_consultas_realizado_por_fkey`;

-- AlterTable
ALTER TABLE `horarios_medicos` DROP COLUMN `day_of_week`;

-- DropTable
DROP TABLE `historicos_consultas`;
