-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 13, 2025 at 01:45 AM
-- Server version: 10.11.6-MariaDB-log
-- PHP Version: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `paysnap_core`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` int(10) UNSIGNED NOT NULL,
  `type` enum('billing','mailing') NOT NULL,
  `address_line` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `zip_code` varchar(255) DEFAULT NULL,
  `country_code` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `type`, `address_line`, `street`, `zip_code`, `country_code`, `city`, `created_at`, `updated_at`) VALUES
(1, 'mailing', 'Some address 1', NULL, '2000', 'BD', 'Dhaka', '2025-03-12 17:38:23', '2025-03-12 17:38:23'),
(2, 'mailing', 'Some address 2', NULL, '2000', 'CI', 'Dhaka', '2025-03-12 17:38:23', '2025-03-12 17:38:23'),
(3, 'mailing', 'Some address 3', NULL, '2000', 'CI', 'Dhaka', '2025-03-12 17:38:23', '2025-03-12 17:38:23'),
(4, 'mailing', 'Some address 4', NULL, '2000', 'CI', 'Dhaka', '2025-03-12 17:38:23', '2025-03-12 17:38:23'),
(5, 'mailing', 'Some address 5', NULL, '2000', 'CI', 'Dhaka', '2025-03-12 17:38:23', '2025-03-12 17:38:23'),
(6, 'mailing', 'Some address 6', NULL, '2000', 'CI', 'Dhaka', '2025-03-12 17:38:23', '2025-03-12 17:38:23');

-- --------------------------------------------------------

--
-- Table structure for table `adonis_schema`
--

CREATE TABLE `adonis_schema` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  `migration_time` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `adonis_schema`
--

INSERT INTO `adonis_schema` (`id`, `name`, `batch`, `migration_time`) VALUES
(1, 'database/migrations/1720270344681_create_roles_table', 1, '2025-03-12 17:37:47'),
(2, 'database/migrations/1720270344682_create_users_table', 1, '2025-03-12 17:37:47'),
(3, 'database/migrations/1721148575941_create_remember_me_tokens_table', 1, '2025-03-12 17:37:47'),
(4, 'database/migrations/1721150395887_create_addresses_table', 1, '2025-03-12 17:37:47'),
(5, 'database/migrations/1721150395888_create_customers_table', 1, '2025-03-12 17:37:48'),
(6, 'database/migrations/1721150413844_create_merchants_table', 1, '2025-03-12 17:37:48'),
(7, 'database/migrations/1721150421683_create_agents_table', 1, '2025-03-12 17:37:49'),
(8, 'database/migrations/1721150433086_create_permissions_table', 1, '2025-03-12 17:37:49'),
(9, 'database/migrations/1721232106818_create_tokens_table', 1, '2025-03-12 17:37:49'),
(10, 'database/migrations/1722338488434_create_translations_table', 1, '2025-03-12 17:37:49'),
(11, 'database/migrations/1723107934558_create_currencies_table', 1, '2025-03-12 17:37:50'),
(12, 'database/migrations/1723107941031_create_wallets_table', 1, '2025-03-12 17:37:50'),
(13, 'database/migrations/1723311241482_create_kycs_table', 1, '2025-03-12 17:37:50'),
(14, 'database/migrations/1723639150073_create_transactions_table', 1, '2025-03-12 17:37:51'),
(15, 'database/migrations/1723650233989_create_deposit_gateways_table', 1, '2025-03-12 17:37:51'),
(16, 'database/migrations/1723650251746_create_withdraw_methods_table', 1, '2025-03-12 17:37:51'),
(17, 'database/migrations/1723657674249_create_contacts_table', 1, '2025-03-12 17:37:51'),
(18, 'database/migrations/1724498210729_create_saves_table', 1, '2025-03-12 17:37:51'),
(19, 'database/migrations/1724731690685_create_settings_table', 1, '2025-03-12 17:37:52'),
(20, 'database/migrations/1725376963085_create_agent_methods_table', 1, '2025-03-12 17:37:52'),
(21, 'database/migrations/1725736620146_create_blacklisted_gateways_table', 1, '2025-03-12 17:37:52'),
(22, 'database/migrations/1725736637443_create_blacklisted_methods_table', 1, '2025-03-12 17:37:53'),
(23, 'database/migrations/1726075888889_create_login_sessions_table', 1, '2025-03-12 17:37:53'),
(24, 'database/migrations/1727529987231_create_commissions_table', 1, '2025-03-12 17:37:53'),
(25, 'database/migrations/1727645977289_create_notifications_table', 1, '2025-03-12 17:37:53'),
(26, 'database/migrations/1730563529986_create_merchant_webhooks_table', 1, '2025-03-12 17:37:54'),
(27, 'database/migrations/1738500414821_create_investment_plans_table', 1, '2025-03-12 17:37:54'),
(28, 'database/migrations/1738502047874_create_investments_table', 1, '2025-03-12 17:37:54'),
(29, 'database/migrations/1738763498205_create_external_plugins_table', 1, '2025-03-12 17:37:54'),
(30, 'database/migrations/1738767592257_create_cardholder_customers_table', 1, '2025-03-12 17:37:55'),
(31, 'database/migrations/1738768161004_create_cards_table', 1, '2025-03-12 17:37:55'),
(32, 'database/migrations/1738768161005_update_ex1_external_plugins_table', 1, '2025-03-12 17:37:55'),
(33, 'database/migrations/1738768161005_update_external_plugins_table', 1, '2025-03-12 17:37:55');

-- --------------------------------------------------------

--
-- Table structure for table `adonis_schema_versions`
--

CREATE TABLE `adonis_schema_versions` (
  `version` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `adonis_schema_versions`
--

INSERT INTO `adonis_schema_versions` (`version`) VALUES
(2);

-- --------------------------------------------------------

--
-- Table structure for table `agents`
--

CREATE TABLE `agents` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `address_id` int(10) UNSIGNED DEFAULT NULL,
  `agent_id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `occupation` varchar(255) DEFAULT NULL,
  `whatsapp` varchar(255) DEFAULT NULL,
  `status` enum('pending','verified','failed') NOT NULL,
  `processing_time` double DEFAULT 2,
  `is_recommended` tinyint(1) DEFAULT 0,
  `is_suspend` tinyint(1) DEFAULT 0,
  `proof` varchar(255) DEFAULT NULL,
  `deposit_charge` double DEFAULT NULL,
  `withdrawal_charge` double DEFAULT NULL,
  `deposit_commission` double DEFAULT NULL,
  `withdrawal_commission` double DEFAULT NULL,
  `deposit_fee` double DEFAULT NULL,
  `withdrawal_fee` double DEFAULT NULL,
  `exchange_fee` double DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `agent_methods`
--

CREATE TABLE `agent_methods` (
  `id` int(10) UNSIGNED NOT NULL,
  `agent_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  `country_code` varchar(255) DEFAULT NULL,
  `currency_code` varchar(255) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `allow_deposit` tinyint(1) NOT NULL DEFAULT 1,
  `allow_withdraw` tinyint(1) NOT NULL DEFAULT 1,
  `required_input` tinyint(1) NOT NULL DEFAULT 0,
  `input_type` enum('email','phone','other') DEFAULT 'phone',
  `other_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blacklisted_gateways`
--

CREATE TABLE `blacklisted_gateways` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `gateway_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blacklisted_methods`
--

CREATE TABLE `blacklisted_methods` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `method_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cards`
--

CREATE TABLE `cards` (
  `id` int(10) UNSIGNED NOT NULL,
  `card_id` varchar(255) NOT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `wallet_id` int(10) UNSIGNED DEFAULT NULL,
  `number` varchar(255) NOT NULL,
  `cvc` varchar(255) NOT NULL,
  `last_four` varchar(255) NOT NULL,
  `brand` varchar(255) NOT NULL,
  `exp_month` varchar(255) NOT NULL,
  `exp_year` varchar(255) NOT NULL,
  `status` enum('active','inactive','canceled') NOT NULL DEFAULT 'active',
  `type` enum('virtual','physical') NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `commissions`
--

CREATE TABLE `commissions` (
  `id` int(10) UNSIGNED NOT NULL,
  `agent_id` int(10) UNSIGNED DEFAULT NULL,
  `transaction_id` int(10) UNSIGNED DEFAULT NULL,
  `amount` double NOT NULL,
  `status` enum('pending','completed','failed') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `contact_id` int(10) UNSIGNED NOT NULL,
  `quick_send` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `currencies`
--

CREATE TABLE `currencies` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `usd_rate` double DEFAULT 1,
  `accept_api_rate` tinyint(1) DEFAULT 0,
  `is_crypto` tinyint(1) DEFAULT 0,
  `active` tinyint(1) DEFAULT 0,
  `meta_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta_data`)),
  `kyc_limit` double DEFAULT NULL,
  `notification_limit` double DEFAULT NULL,
  `min_amount` double NOT NULL,
  `max_amount` double NOT NULL,
  `daily_transfer_amount` double DEFAULT NULL,
  `daily_transfer_limit` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `currencies`
--

INSERT INTO `currencies` (`id`, `name`, `code`, `icon`, `usd_rate`, `accept_api_rate`, `is_crypto`, `active`, `meta_data`, `kyc_limit`, `notification_limit`, `min_amount`, `max_amount`, `daily_transfer_amount`, `daily_transfer_limit`, `created_at`, `updated_at`) VALUES
(2, 'US Dollar', 'USD', NULL, 1, 1, 0, 1, NULL, 250, 300, 1, 1000, 5000, 10, '2025-03-12 17:37:50', '2025-03-12 17:37:50');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `address_id` int(10) UNSIGNED DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `gender` enum('male','female') DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `cardholder_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `user_id`, `address_id`, `first_name`, `last_name`, `profile_image`, `phone`, `gender`, `dob`, `created_at`, `updated_at`, `cardholder_id`) VALUES
(1, 1, 1, 'Test', 'Admin', NULL, '88017000000001', 'male', '2000-01-01', '2025-03-12 17:38:23', '2025-03-12 17:38:23', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `deposit_gateways`
--

CREATE TABLE `deposit_gateways` (
  `id` int(10) UNSIGNED NOT NULL,
  `logo_image` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `api_key` varchar(255) DEFAULT NULL,
  `secret_key` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 0,
  `active_api` tinyint(1) DEFAULT 0,
  `is_crypto` tinyint(1) DEFAULT 0,
  `recommended` tinyint(1) DEFAULT 0,
  `ex1` varchar(255) DEFAULT NULL,
  `ex2` varchar(255) DEFAULT NULL,
  `variables` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`variables`)),
  `allowed_currencies` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`allowed_currencies`)),
  `allowed_countries` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`allowed_countries`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `deposit_gateways`
--

INSERT INTO `deposit_gateways` (`id`, `logo_image`, `name`, `value`, `api_key`, `secret_key`, `active`, `active_api`, `is_crypto`, `recommended`, `ex1`, `ex2`, `variables`, `allowed_currencies`, `allowed_countries`, `created_at`, `updated_at`) VALUES
(1, NULL, 'MTN/Orange/Expresso/TMoney/Moov', 'paydunya', NULL, NULL, 0, 0, 0, 0, NULL, NULL, NULL, '[\"XOF\",\"XAF\"]', '[\"*\"]', '2025-03-12 17:38:19', '2025-03-12 17:38:19'),
(2, NULL, 'Perfect Money', 'perfectmoney', NULL, NULL, 0, 0, 0, 0, NULL, NULL, NULL, '[\"USD\",\"EUR\"]', '[\"*\"]', '2025-03-12 17:38:19', '2025-03-12 17:38:19'),
(3, NULL, 'Wave', 'wave', NULL, NULL, 0, 0, 0, 0, NULL, NULL, NULL, '[\"XOF\",\"XAF\"]', '[\"*\"]', '2025-03-12 17:38:20', '2025-03-12 17:38:20'),
(4, NULL, 'Stripe', 'stripe', NULL, NULL, 0, 0, 0, 0, NULL, NULL, NULL, '[\"USD\",\"EUR\",\"GBP\"]', '[\"*\"]', '2025-03-12 17:38:20', '2025-03-12 17:38:20'),
(5, NULL, 'Coinbase', 'coinbase', NULL, NULL, 0, 0, 0, 0, NULL, NULL, NULL, '[\"USD\",\"EUR\",\"GBP\"]', '[\"*\"]', '2025-03-12 17:38:20', '2025-03-12 17:38:20'),
(6, NULL, 'Flutterwave', 'flutterwave', NULL, NULL, 0, 0, 0, 0, NULL, NULL, NULL, '[\"GBP\",\"CAD\",\"XAF\",\"CLP\",\"COP\",\"EGP\",\"EUR\",\"GHS\",\"GNF\",\"KES\",\"MWK\",\"MAD\",\"NGN\",\"RWF\",\"SLL\",\"STD\",\"ZAR\",\"TZS\",\"UGX\",\"USD\",\"XOF\",\"ZMW\"]', '[\"*\"]', '2025-03-12 17:38:20', '2025-03-12 17:38:20'),
(7, NULL, 'PayPal', 'paypal', NULL, NULL, 0, 0, 0, 0, 'sandbox', NULL, NULL, '[\"USD\",\"EUR\",\"GBP\"]', '[\"*\"]', '2025-03-12 17:38:20', '2025-03-12 17:38:20'),
(8, NULL, 'Mollie', 'mollie', NULL, NULL, 0, 0, 0, 0, NULL, NULL, NULL, '[\"USD\",\"EUR\",\"GBP\",\"AUD\",\"CAD\"]', '[\"*\"]', '2025-03-12 17:38:20', '2025-03-12 17:38:20'),
(9, NULL, 'Razorpay', 'razorpay', NULL, NULL, 0, 0, 0, 0, NULL, NULL, NULL, '[\"USD\",\"EUR\",\"GBP\",\"AUD\",\"CAD\",\"INR\",\"SGD\"]', '[\"*\"]', '2025-03-12 17:38:20', '2025-03-12 17:38:20'),
(10, NULL, 'Coingate', 'coingate', NULL, NULL, 0, 0, 1, 0, 'sandbox', NULL, NULL, '[\"USD\",\"BTC\",\"EUR\",\"GBP\",\"PLN\",\"CZK\",\"SEK\",\"NOK\",\"DKK\",\"CHF\",\"ZAR\",\"AUD\",\"JPY\",\"NZD\",\"TRY\",\"BRL\",\"CAD\",\"CNY\",\"HKD\",\"HUF\",\"INR\",\"RUB\",\"ILS\",\"MYR\",\"MXN\",\"SGD\",\"RON\",\"IDR\",\"PHP\",\"ARS\",\"THB\",\"NGN\",\"PKR\",\"AED\",\"UAH\",\"BGN\",\"HRK\",\"RSD\",\"LTC\",\"ETH\",\"BCH\",\"XRP\",\"TWD\",\"CLP\",\"TRX\",\"DAI\",\"DOGE\",\"BNB\",\"USDT\",\"AVA\",\"KRW\",\"EGP\",\"SAR\",\"QAR\",\"POL\",\"USDC\",\"BUSD\",\"SOL\",\"SHIB\",\"AVAX\",\"ATOM\",\"EGLD\",\"FLOW\",\"BTTC\",\"ARB\"]', '[\"*\"]', '2025-03-12 17:38:20', '2025-03-12 17:38:20'),
(11, NULL, 'NowPayments', 'nowpayments', NULL, NULL, 0, 0, 1, 0, NULL, NULL, NULL, '[\"BTC\",\"ETH\",\"BNB\",\"USDT\",\"USD\",\"EUR\"]', '[\"*\"]', '2025-03-12 17:38:20', '2025-03-12 17:38:20'),
(12, NULL, 'bKash', 'bkash', NULL, NULL, 0, 0, 0, 0, NULL, NULL, NULL, '[\"BDT\"]', '[\"*\"]', '2025-03-12 17:38:20', '2025-03-12 17:38:20'),
(13, NULL, 'Paystack', 'paystack', NULL, NULL, 0, 0, 0, 0, NULL, NULL, NULL, '[\"NGN\",\"GHS\",\"ZAR\",\"KES\"]', '[\"*\"]', '2025-03-12 17:38:20', '2025-03-12 17:38:20'),
(14, NULL, 'Cashfree Payments', 'cashfree', NULL, NULL, 0, 0, 0, 0, NULL, NULL, NULL, '[\"INR\"]', '[\"*\"]', '2025-03-12 17:38:20', '2025-03-12 17:38:20'),
(15, NULL, 'Payfast', 'payfast', NULL, NULL, 0, 0, 0, 0, 'sandbox', NULL, NULL, '[\"ZAR\"]', '[\"*\"]', '2025-03-12 17:38:20', '2025-03-12 17:38:20');

-- --------------------------------------------------------

--
-- Table structure for table `external_plugins`
--

CREATE TABLE `external_plugins` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `api_key` text DEFAULT NULL,
  `api_key_2` varchar(255) DEFAULT NULL,
  `api_key_3` varchar(255) DEFAULT NULL,
  `secret_key` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `ex_1` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `external_plugins`
--

INSERT INTO `external_plugins` (`id`, `name`, `value`, `api_key`, `api_key_2`, `api_key_3`, `secret_key`, `active`, `created_at`, `updated_at`, `ex_1`) VALUES
(1, 'Stripe Cards', 'stripe-cards', NULL, NULL, NULL, NULL, 0, '2025-03-12 17:38:19', '2025-03-12 17:38:19', NULL),
(2, 'Sudo Africa', 'sudo-africa', NULL, 'sandbox', NULL, 'Verve', 0, '2025-03-12 17:38:19', '2025-03-12 17:38:19', NULL),
(3, 'Currency API', 'currency-api', NULL, NULL, NULL, NULL, 0, '2025-03-12 17:38:19', '2025-03-12 17:38:19', NULL),
(4, 'Reloadly', 'reloadly', NULL, 'sandbox', NULL, NULL, 0, '2025-03-12 17:38:19', '2025-03-12 17:38:19', NULL),
(5, 'Tawk.to Chat', 'tawk-to', NULL, NULL, NULL, NULL, 0, '2025-03-12 17:38:19', '2025-03-12 17:38:19', NULL),
(6, 'Google Analytics', 'google-analytics', NULL, NULL, NULL, NULL, 0, '2025-03-12 17:38:19', '2025-03-12 17:38:19', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `investments`
--

CREATE TABLE `investments` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `amount_invested` double NOT NULL,
  `currency` varchar(255) NOT NULL,
  `interest_rate` double NOT NULL,
  `profit` double NOT NULL,
  `duration` int(11) NOT NULL,
  `duration_type` enum('daily','weekly','monthly','yearly') NOT NULL,
  `withdraw_after_matured` tinyint(1) DEFAULT 1,
  `status` enum('active','completed','withdrawn','on_hold') DEFAULT 'active',
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `ends_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `investment_plans`
--

CREATE TABLE `investment_plans` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_featured` tinyint(1) DEFAULT 0,
  `is_range` tinyint(1) DEFAULT 1,
  `min_amount` double NOT NULL,
  `max_amount` double DEFAULT NULL,
  `currency` varchar(255) NOT NULL,
  `interest_rate` double NOT NULL,
  `duration` int(11) NOT NULL,
  `duration_type` enum('daily','weekly','monthly','yearly') NOT NULL,
  `withdraw_after_matured` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kycs`
--

CREATE TABLE `kycs` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `document_type` enum('nid','passport','document','driving') DEFAULT NULL,
  `selfie` varchar(255) DEFAULT NULL,
  `front` varchar(255) DEFAULT NULL,
  `back` varchar(255) DEFAULT NULL,
  `status` enum('pending','verified','failed') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `login_sessions`
--

CREATE TABLE `login_sessions` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `session_id` varchar(255) NOT NULL,
  `session_token` varchar(255) NOT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `device_name` varchar(255) DEFAULT NULL,
  `fingerprint` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `merchants`
--

CREATE TABLE `merchants` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `address_id` int(10) UNSIGNED DEFAULT NULL,
  `merchant_id` varchar(255) NOT NULL,
  `store_profile_image` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `status` enum('pending','verified','failed') NOT NULL,
  `is_suspend` tinyint(1) DEFAULT 0,
  `proof` varchar(255) DEFAULT NULL,
  `deposit_fee` double DEFAULT NULL,
  `withdrawal_fee` double DEFAULT NULL,
  `exchange_fee` double DEFAULT NULL,
  `transfer_fee` double DEFAULT NULL,
  `payment_fee` double DEFAULT NULL,
  `api_key` varchar(255) DEFAULT NULL,
  `allowed_ip` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `merchant_webhooks`
--

CREATE TABLE `merchant_webhooks` (
  `id` int(10) UNSIGNED NOT NULL,
  `type` varchar(255) NOT NULL,
  `webhook_url` varchar(255) NOT NULL,
  `request_body` text NOT NULL,
  `response_body` text NOT NULL,
  `status_code` int(11) NOT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(10) UNSIGNED NOT NULL,
  `type` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `body` varchar(255) NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `is_system` tinyint(1) DEFAULT 0,
  `navigate` varchar(255) DEFAULT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `deposit` tinyint(1) DEFAULT 1,
  `withdraw` tinyint(1) DEFAULT 1,
  `payment` tinyint(1) DEFAULT 1,
  `exchange` tinyint(1) DEFAULT 1,
  `transfer` tinyint(1) DEFAULT 1,
  `add_account` tinyint(1) DEFAULT 1,
  `add_remove_balance` tinyint(1) DEFAULT 1,
  `services` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `user_id`, `deposit`, `withdraw`, `payment`, `exchange`, `transfer`, `add_account`, `add_remove_balance`, `services`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-03-12 17:38:22', '2025-03-12 17:38:22');

-- --------------------------------------------------------

--
-- Table structure for table `remember_me_tokens`
--

CREATE TABLE `remember_me_tokens` (
  `id` int(10) UNSIGNED NOT NULL,
  `tokenable_id` int(10) UNSIGNED NOT NULL,
  `hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  `expires_at` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Admin', '2025-03-12 17:37:47', '2025-03-12 17:37:47'),
(2, 'Customer', '2025-03-12 17:37:47', '2025-03-12 17:37:47'),
(3, 'Merchant', '2025-03-12 17:37:47', '2025-03-12 17:37:47'),
(4, 'Agent', '2025-03-12 17:37:47', '2025-03-12 17:37:47'),
(5, 'Supervisor', '2025-03-12 17:37:47', '2025-03-12 17:37:47');

-- --------------------------------------------------------

--
-- Table structure for table `saves`
--

CREATE TABLE `saves` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `type` enum('wallet','merchant','phone','electricity') DEFAULT NULL,
  `info` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `related_model` varchar(255) DEFAULT NULL,
  `related_model_id` int(11) DEFAULT NULL,
  `meta_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta_data`)),
  `is_bookmarked` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(10) UNSIGNED NOT NULL,
  `key` varchar(255) NOT NULL,
  `value_1` varchar(255) DEFAULT NULL,
  `value_2` varchar(255) DEFAULT NULL,
  `value_3` varchar(255) DEFAULT NULL,
  `value_4` varchar(255) DEFAULT NULL,
  `value_5` text DEFAULT NULL,
  `file` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `key`, `value_1`, `value_2`, `value_3`, `value_4`, `value_5`, `file`, `created_at`, `updated_at`) VALUES
(1, 'deposit', 'on', '0.5', NULL, NULL, NULL, NULL, '2025-03-12 17:38:21', '2025-03-12 17:38:21'),
(2, 'withdraw', 'on', '0.5', NULL, NULL, NULL, NULL, '2025-03-12 17:38:21', '2025-03-12 17:38:21'),
(3, 'transfer', 'on', '0.5', NULL, NULL, NULL, NULL, '2025-03-12 17:38:21', '2025-03-12 17:38:21'),
(4, 'payment', 'on', '0.5', NULL, NULL, NULL, NULL, '2025-03-12 17:38:21', '2025-03-12 17:38:21'),
(5, 'exchange', 'off', '0.5', NULL, NULL, NULL, NULL, '2025-03-12 17:38:21', '2025-03-12 17:38:21'),
(6, 'topup', 'off', '0.5', NULL, NULL, NULL, NULL, '2025-03-12 17:38:21', '2025-03-12 17:38:21'),
(7, 'electricity_bill', 'off', '0.5', NULL, NULL, NULL, NULL, '2025-03-12 17:38:21', '2025-03-12 17:38:21'),
(8, 'deposit_commission', 'on', '1.0', NULL, NULL, NULL, NULL, '2025-03-12 17:38:21', '2025-03-12 17:38:21'),
(9, 'withdraw_commission', 'on', '1.5', NULL, NULL, NULL, NULL, '2025-03-12 17:38:21', '2025-03-12 17:38:21'),
(10, 'langs', NULL, NULL, NULL, NULL, '[{\"code\":\"en\",\"name\":\"English\"},{\"code\":\"es\",\"name\":\"Español\"},{\"code\":\"fr\",\"name\":\"French\"},{\"code\":\"de\",\"name\":\"Deutsch\"},{\"code\":\"ru\",\"name\":\"Russian\"},{\"code\":\"pt\",\"name\":\"Portuguese\"},{\"code\":\"cn\",\"name\":\"Chinese\"}]', NULL, '2025-03-12 17:38:21', '2025-03-12 17:38:21'),
(11, 'branding', 'PaySnap', 'https://awdfe.abidr.me', 'https://awdpayapi.abidr.me', 'USD', 'en', NULL, '2025-03-12 17:38:21', '2025-03-12 17:38:21'),
(12, 'favicon', NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-12 17:38:21', '2025-03-12 17:38:21'),
(13, 'authBanner', NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-12 17:38:21', '2025-03-12 17:38:21'),
(14, 'cardBg', NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-12 17:38:21', '2025-03-12 17:38:21'),
(15, 'referral', '0', 'referrer', 'kyc', NULL, NULL, NULL, '2025-03-12 17:38:21', '2025-03-12 17:38:21'),
(16, 'customer_registration', 'on', NULL, NULL, NULL, NULL, NULL, '2025-03-12 17:38:21', '2025-03-12 17:38:21'),
(17, 'agent_registration', 'on', NULL, NULL, NULL, NULL, NULL, '2025-03-12 17:38:21', '2025-03-12 17:38:21'),
(18, 'merchant_registration', 'on', NULL, NULL, NULL, NULL, NULL, '2025-03-12 17:38:22', '2025-03-12 17:38:22'),
(19, 'virtual_card', 'off', 'sudo-africa', NULL, NULL, NULL, NULL, '2025-03-12 17:38:22', '2025-03-12 17:38:22');

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `type` varchar(50) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(10) UNSIGNED NOT NULL,
  `trx_id` varchar(255) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
    `from` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`from`)),
    `to` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`to`)),
  `amount` double NOT NULL,
  `fee` double NOT NULL,
  `total` double NOT NULL,
  `status` enum('pending','completed','failed') DEFAULT NULL,
  `method` varchar(255) DEFAULT NULL,
  `is_bookmarked` tinyint(1) DEFAULT 0,
  `meta_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta_data`)),
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `translations`
--

CREATE TABLE `translations` (
  `id` int(10) UNSIGNED NOT NULL,
  `code` varchar(255) NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `role_id` int(10) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `is_email_verified` tinyint(1) DEFAULT 0,
  `status` tinyint(1) DEFAULT 0,
  `password` varchar(255) NOT NULL,
  `kyc_status` tinyint(1) DEFAULT 0,
  `last_ip_address` varchar(255) DEFAULT NULL,
  `last_country_name` varchar(255) DEFAULT NULL,
  `password_updated` int(11) DEFAULT 1741801042,
  `referral_code` varchar(255) NOT NULL,
  `referred_by` int(10) UNSIGNED DEFAULT NULL,
  `referral_handled` tinyint(1) DEFAULT 0,
  `otp_code` varchar(255) DEFAULT NULL,
  `accept_terms_condition` tinyint(1) DEFAULT 1,
  `limit_transfer` tinyint(1) DEFAULT 1,
  `daily_transfer_limit` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role_id`, `email`, `is_email_verified`, `status`, `password`, `kyc_status`, `last_ip_address`, `last_country_name`, `password_updated`, `referral_code`, `referred_by`, `referral_handled`, `otp_code`, `accept_terms_condition`, `limit_transfer`, `daily_transfer_limit`, `created_at`, `updated_at`) VALUES
(1, 1, 'admin@test.com', 1, 1, '$scrypt$n=16384,r=8,p=1$bSDJ5ZSeoX9w+p1ayPCOjw$fUzHFFiS+YiZ+QvEWR9Jn+qmhcZ1X6hnPNZvX8/geRjq2bMYa6ni6bdh582FCNIZb7LivuQMnkwrIp1Woe0+5Q', 0, NULL, NULL, 1741801042, '46MLWU', NULL, 0, NULL, 1, 0, NULL, '2025-03-12 17:38:22', '2025-03-12 17:38:22');

-- --------------------------------------------------------

--
-- Table structure for table `wallets`
--

CREATE TABLE `wallets` (
  `id` int(10) UNSIGNED NOT NULL,
  `wallet_id` varchar(255) NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `balance` double NOT NULL,
  `default` tinyint(1) DEFAULT 0,
  `pin_dashboard` tinyint(1) DEFAULT 1,
  `currency_id` int(10) UNSIGNED DEFAULT NULL,
  `daily_transfer_amount` double DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `wallets`
--

INSERT INTO `wallets` (`id`, `wallet_id`, `user_id`, `balance`, `default`, `pin_dashboard`, `currency_id`, `daily_transfer_amount`, `created_at`, `updated_at`) VALUES
(1, 'W538444', 1, 0, 1, 1, 2, 1500000, '2025-03-12 17:38:23', '2025-03-12 17:38:23');

-- --------------------------------------------------------

--
-- Table structure for table `withdraw_methods`
--

CREATE TABLE `withdraw_methods` (
  `id` int(10) UNSIGNED NOT NULL,
  `logo_image` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `api_key` varchar(255) DEFAULT NULL,
  `secret_key` varchar(255) DEFAULT NULL,
  `params` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`params`)),
  `currency_code` varchar(255) DEFAULT NULL,
  `country_code` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 0,
  `active_api` tinyint(1) DEFAULT 0,
  `recommended` tinyint(1) DEFAULT 0,
  `variable` varchar(255) DEFAULT NULL,
  `ex1` varchar(255) DEFAULT NULL,
  `ex2` varchar(255) DEFAULT NULL,
  `min_amount` double NOT NULL,
  `max_amount` double NOT NULL,
  `fixed_charge` double DEFAULT 0,
  `percentage_charge` double DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `withdraw_methods`
--

INSERT INTO `withdraw_methods` (`id`, `logo_image`, `name`, `value`, `api_key`, `secret_key`, `params`, `currency_code`, `country_code`, `active`, `active_api`, `recommended`, `variable`, `ex1`, `ex2`, `min_amount`, `max_amount`, `fixed_charge`, `percentage_charge`, `created_at`, `updated_at`) VALUES
(1, NULL, 'Bank (USD)', 'bank_usd', NULL, NULL, '[{\"name\":\"accountNumber\",\"label\":\"Account Number\",\"type\":\"text\",\"required\":true},{\"name\":\"accountName\",\"label\":\"Account Name\",\"type\":\"text\",\"required\":true},{\"name\":\"bankName\",\"label\":\"Bank Name\",\"type\":\"text\",\"required\":true},{\"name\":\"iban\",\"label\":\"IBAN\",\"type\":\"text\",\"required\":true}]', 'USD', '*', 1, 1, 0, NULL, NULL, NULL, 1, 2500, 3, 3, '2025-03-12 17:38:24', '2025-03-12 17:38:24'),
(2, NULL, 'Bank (EUR)', 'bank_eur', NULL, NULL, '[{\"name\":\"accountNumber\",\"label\":\"Account Number\",\"type\":\"text\",\"required\":true},{\"name\":\"accountName\",\"label\":\"Account Name\",\"type\":\"text\",\"required\":true},{\"name\":\"bankName\",\"label\":\"Bank Name\",\"type\":\"text\",\"required\":true},{\"name\":\"iban\",\"label\":\"IBAN\",\"type\":\"text\",\"required\":true}]', 'USD', '*', 1, 1, 0, NULL, NULL, NULL, 1, 2500, 3, 3, '2025-03-12 17:38:24', '2025-03-12 17:38:24'),
(3, NULL, 'Tether USDT (TRC20)', 'usdt_trc20', NULL, NULL, '[{\"name\":\"extWallet\",\"label\":\"Wallet ID\",\"type\":\"text\",\"required\":true}]', 'USD', '*', 1, 1, 0, NULL, NULL, NULL, 1, 2500, 3, 3, '2025-03-12 17:38:24', '2025-03-12 17:38:24'),
(4, NULL, 'PERFECTMONEY USD', 'perfectmoney_dollar', '89812225', 'Ru11501718Ru', '[{\"name\":\"extWallet\",\"label\":\"Wallet ID\",\"type\":\"text\",\"required\":true}]', 'USD', '*', 1, 1, 0, NULL, 'U35368357', NULL, 1, 2500, 0.5, 5, '2025-03-12 17:38:24', '2025-03-12 17:38:24'),
(5, NULL, 'PERFECTMONEY EUR', 'perfectmoney_euro', '89812225', 'Ru11501718Ru', '[{\"name\":\"extWallet\",\"label\":\"Wallet ID\",\"type\":\"text\",\"required\":true}]', 'EUR', '*', 1, 1, 0, NULL, 'E33172315', NULL, 1, 2500, 0.4, 5, '2025-03-12 17:38:24', '2025-03-12 17:38:24');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `adonis_schema`
--
ALTER TABLE `adonis_schema`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `adonis_schema_versions`
--
ALTER TABLE `adonis_schema_versions`
  ADD PRIMARY KEY (`version`);

--
-- Indexes for table `agents`
--
ALTER TABLE `agents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `agents_agent_id_unique` (`agent_id`),
  ADD KEY `agents_user_id_foreign` (`user_id`),
  ADD KEY `agents_address_id_foreign` (`address_id`);

--
-- Indexes for table `agent_methods`
--
ALTER TABLE `agent_methods`
  ADD PRIMARY KEY (`id`),
  ADD KEY `agent_methods_agent_id_foreign` (`agent_id`);

--
-- Indexes for table `blacklisted_gateways`
--
ALTER TABLE `blacklisted_gateways`
  ADD PRIMARY KEY (`id`),
  ADD KEY `blacklisted_gateways_user_id_foreign` (`user_id`),
  ADD KEY `blacklisted_gateways_gateway_id_foreign` (`gateway_id`);

--
-- Indexes for table `blacklisted_methods`
--
ALTER TABLE `blacklisted_methods`
  ADD PRIMARY KEY (`id`),
  ADD KEY `blacklisted_methods_user_id_foreign` (`user_id`),
  ADD KEY `blacklisted_methods_method_id_foreign` (`method_id`);

--
-- Indexes for table `cards`
--
ALTER TABLE `cards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cards_user_id_foreign` (`user_id`),
  ADD KEY `cards_wallet_id_foreign` (`wallet_id`);

--
-- Indexes for table `commissions`
--
ALTER TABLE `commissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `commissions_agent_id_foreign` (`agent_id`),
  ADD KEY `commissions_transaction_id_foreign` (`transaction_id`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contacts_user_id_foreign` (`user_id`),
  ADD KEY `contacts_contact_id_foreign` (`contact_id`);

--
-- Indexes for table `currencies`
--
ALTER TABLE `currencies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customers_user_id_foreign` (`user_id`),
  ADD KEY `customers_address_id_foreign` (`address_id`);

--
-- Indexes for table `deposit_gateways`
--
ALTER TABLE `deposit_gateways`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `external_plugins`
--
ALTER TABLE `external_plugins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `investments`
--
ALTER TABLE `investments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `investments_user_id_foreign` (`user_id`);

--
-- Indexes for table `investment_plans`
--
ALTER TABLE `investment_plans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kycs`
--
ALTER TABLE `kycs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kycs_user_id_foreign` (`user_id`);

--
-- Indexes for table `login_sessions`
--
ALTER TABLE `login_sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `login_sessions_session_id_unique` (`session_id`),
  ADD UNIQUE KEY `login_sessions_session_token_unique` (`session_token`),
  ADD KEY `login_sessions_user_id_foreign` (`user_id`);

--
-- Indexes for table `merchants`
--
ALTER TABLE `merchants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `merchants_merchant_id_unique` (`merchant_id`),
  ADD KEY `merchants_user_id_foreign` (`user_id`),
  ADD KEY `merchants_address_id_foreign` (`address_id`);

--
-- Indexes for table `merchant_webhooks`
--
ALTER TABLE `merchant_webhooks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `merchant_webhooks_user_id_foreign` (`user_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_user_id_foreign` (`user_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `permissions_user_id_foreign` (`user_id`);

--
-- Indexes for table `remember_me_tokens`
--
ALTER TABLE `remember_me_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `remember_me_tokens_hash_unique` (`hash`),
  ADD KEY `remember_me_tokens_tokenable_id_foreign` (`tokenable_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `saves`
--
ALTER TABLE `saves`
  ADD PRIMARY KEY (`id`),
  ADD KEY `saves_user_id_foreign` (`user_id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tokens_token_unique` (`token`),
  ADD KEY `tokens_user_id_foreign` (`user_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transactions_trx_id_unique` (`trx_id`),
  ADD KEY `transactions_user_id_foreign` (`user_id`);

--
-- Indexes for table `translations`
--
ALTER TABLE `translations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_role_id_foreign` (`role_id`),
  ADD KEY `users_referred_by_foreign` (`referred_by`);

--
-- Indexes for table `wallets`
--
ALTER TABLE `wallets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `wallets_wallet_id_unique` (`wallet_id`),
  ADD KEY `wallets_user_id_foreign` (`user_id`),
  ADD KEY `wallets_currency_id_foreign` (`currency_id`);

--
-- Indexes for table `withdraw_methods`
--
ALTER TABLE `withdraw_methods`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `adonis_schema`
--
ALTER TABLE `adonis_schema`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `agents`
--
ALTER TABLE `agents`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `agent_methods`
--
ALTER TABLE `agent_methods`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `blacklisted_gateways`
--
ALTER TABLE `blacklisted_gateways`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `blacklisted_methods`
--
ALTER TABLE `blacklisted_methods`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cards`
--
ALTER TABLE `cards`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `commissions`
--
ALTER TABLE `commissions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `currencies`
--
ALTER TABLE `currencies`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `deposit_gateways`
--
ALTER TABLE `deposit_gateways`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `external_plugins`
--
ALTER TABLE `external_plugins`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `investments`
--
ALTER TABLE `investments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `investment_plans`
--
ALTER TABLE `investment_plans`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `kycs`
--
ALTER TABLE `kycs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `login_sessions`
--
ALTER TABLE `login_sessions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `merchants`
--
ALTER TABLE `merchants`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `merchant_webhooks`
--
ALTER TABLE `merchant_webhooks`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `remember_me_tokens`
--
ALTER TABLE `remember_me_tokens`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `saves`
--
ALTER TABLE `saves`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `translations`
--
ALTER TABLE `translations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `wallets`
--
ALTER TABLE `wallets`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `withdraw_methods`
--
ALTER TABLE `withdraw_methods`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `agents`
--
ALTER TABLE `agents`
  ADD CONSTRAINT `agents_address_id_foreign` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`),
  ADD CONSTRAINT `agents_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `agent_methods`
--
ALTER TABLE `agent_methods`
  ADD CONSTRAINT `agent_methods_agent_id_foreign` FOREIGN KEY (`agent_id`) REFERENCES `agents` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `blacklisted_gateways`
--
ALTER TABLE `blacklisted_gateways`
  ADD CONSTRAINT `blacklisted_gateways_gateway_id_foreign` FOREIGN KEY (`gateway_id`) REFERENCES `deposit_gateways` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `blacklisted_gateways_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `blacklisted_methods`
--
ALTER TABLE `blacklisted_methods`
  ADD CONSTRAINT `blacklisted_methods_method_id_foreign` FOREIGN KEY (`method_id`) REFERENCES `withdraw_methods` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `blacklisted_methods_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cards`
--
ALTER TABLE `cards`
  ADD CONSTRAINT `cards_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `cards_wallet_id_foreign` FOREIGN KEY (`wallet_id`) REFERENCES `wallets` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `commissions`
--
ALTER TABLE `commissions`
  ADD CONSTRAINT `commissions_agent_id_foreign` FOREIGN KEY (`agent_id`) REFERENCES `agents` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `commissions_transaction_id_foreign` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `contacts`
--
ALTER TABLE `contacts`
  ADD CONSTRAINT `contacts_contact_id_foreign` FOREIGN KEY (`contact_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `contacts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customers_address_id_foreign` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`),
  ADD CONSTRAINT `customers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `investments`
--
ALTER TABLE `investments`
  ADD CONSTRAINT `investments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `kycs`
--
ALTER TABLE `kycs`
  ADD CONSTRAINT `kycs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `login_sessions`
--
ALTER TABLE `login_sessions`
  ADD CONSTRAINT `login_sessions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `merchants`
--
ALTER TABLE `merchants`
  ADD CONSTRAINT `merchants_address_id_foreign` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`),
  ADD CONSTRAINT `merchants_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `merchant_webhooks`
--
ALTER TABLE `merchant_webhooks`
  ADD CONSTRAINT `merchant_webhooks_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `permissions`
--
ALTER TABLE `permissions`
  ADD CONSTRAINT `permissions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `remember_me_tokens`
--
ALTER TABLE `remember_me_tokens`
  ADD CONSTRAINT `remember_me_tokens_tokenable_id_foreign` FOREIGN KEY (`tokenable_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `saves`
--
ALTER TABLE `saves`
  ADD CONSTRAINT `saves_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tokens`
--
ALTER TABLE `tokens`
  ADD CONSTRAINT `tokens_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_referred_by_foreign` FOREIGN KEY (`referred_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

--
-- Constraints for table `wallets`
--
ALTER TABLE `wallets`
  ADD CONSTRAINT `wallets_currency_id_foreign` FOREIGN KEY (`currency_id`) REFERENCES `currencies` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `wallets_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
